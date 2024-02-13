// TODO: move to python serverless runtime when stable
import { NextResponse } from "next/server";
import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  experimental_StreamData,
  createStreamDataTransformer,
} from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Client } from "langsmith";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { auth } from "@clerk/nextjs";

import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LLMResult } from "@langchain/core/outputs";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

const CATEGORIES = new Set(["symptom", "history", "final"]);

const SYMPTOM_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You will start by asking the user for their chief complaint, symptoms, and duration.
Then it is up to you to ask follow up questions. You can only ask up to two questions at a time. Some topics to consider include:
- location and radiation
- quality
- severity
- timing
- context
- modifying factors
- associated symptoms
- how the symptoms have affected the user's life

All responses must be respectful. Do not thank the user.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const HISTORY_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You are now asking about their medical history, including any past surgeries, medications, and allergies.
Do this briefly and respectfully, and remember to ask open-ended questions to get the most information. If the answer is superficial, ask for more details.
You can only ask up to two questions at a time.

All responses must be respectful. Do not thank the user.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const SYMPTOM_PROMPT_FROM_REVIEW = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You will be given a conversation from three different experts who have determined that the user has not provided enough information about their symptoms related to their condition.
You will now prompt the user for more information about their symptoms based on the conversation from the experts. You can only ask up to 3 questions at a time.

All responses must be respectful. Do not thank the user.

Experts' conversation:
{expert_conversation}

Formi:`;

const HISTORY_PROMPT_FROM_REVIEW = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You will be given a conversation from three different experts who have determined that the user has not provided enough information about their medical history related to their condition.
You will now prompt the user for more information about their symptoms based on the conversation from the experts. You can only ask up to 3 questions at a time.

All responses must be respectful. Do not thank the user.

Experts' conversation:
{expert_conversation}

Formi:`;

// "All responses must be respectful and you must avoid extra sentences You can only ask 3 questions maximum in your reply."

const FINAL_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You have now gathered enough information about the user's symptoms and medical history.
You will now let the user know that you have enough information to generate a report for their doctor and that the conversation will be archived.

The response must start with \`Thank you for using Formi.\`.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const SYMPTOM_REVIEWER = `Imagine three different experts tasked with classifying if a conversation has enough information for a doctor to review later.
The experts will check if the user has provided enough information about their symptoms related to their condition.
Some topics to consider checking for symptoms include:
- location and radiation
- quality
- severity
- timing
- context
- modifying factors
- associated symptoms
- how the symptoms have affected the user's life

All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave.

After the last expert has shared their thinking, the group will decide if the user has provided enough information about their symptoms.
If the group thinks the user has not provided enough information about their symptoms, the group will respond with \`prompt_user\`.
If the group thinks the user has provided enough information about their symptoms and history, the group will respond with \`next_review\`.

Only one category can be chosen.

Current conversation:
{chat_history}
Last user message: {input}

Classification:`;

// Finally, the group will decide if the user has provided enough information about their symptoms and history.

const HISTORY_REVIEWER = `Imagine three different experts tasked with classifying if a conversation has enough information for a doctor to review later.
The experts will check if the user has provided enough information about their medical history related to their condition.

Some topics to consider checking for medical history include:
- past surgeries
- medications
- allergies
- achohol and drug use
- family history

All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave.

After the last expert has shared their thinking, the group will decide if the user has provided enough information about their symptoms.
If the group thinks the user has not provided enough information about their medical history, the group will respond with \`prompt_user\`.
If the group thinks the user has provided enough information about their symptoms and history, the group will respond with \`final_prompt\`.

Only one category can be chosen.

Current conversation:
{user_messages}
Last user message: {input}

Classification:`;

// Finally, the group will decide if the user has provided enough information about their symptoms and history.

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */

async function handleResponse(
  res: LLMResult,
  chatId: string,
  messages: any[],
  currentMessageContent: string,
  token: string | undefined
) {
  await Promise.all([
    fetchMutation(
      api.chat.createMessage,
      {
        chat_id: chatId as Id<"chat">,
        content: currentMessageContent,
        role: "user",
        index: messages.length - 1,
      },
      {
        token,
      }
    ),
    fetchMutation(
      api.chat.createMessage,
      {
        chat_id: chatId as Id<"chat">,
        content: res.generations?.[0][0].text,
        role: "assistant",
        index: messages.length,
      },
      {
        token,
      }
    ),
  ]);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages, previewToken } = json;
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    console.log("MESSAGES", messages);

    const client = new Client();
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const userOnlyMessages = messages.filter(
      (m: any) => m.role === "user"
    ) as VercelChatMessage[];
    const formattedUserOnlyMessages = userOnlyMessages.map(formatMessage);

    const currentMessageContent = messages[messages.length - 1].content;

    const token = await getAuthToken();

    let chatId: string;
    const data = new experimental_StreamData();

    if (json.id) {
      chatId = json.id;
    } else {
      const title = json.messages[0].content.substring(0, 100);
      chatId = await fetchMutation(
        api.chat.createChat,
        {
          title,
        },
        {
          token,
        }
      );
      data.append({
        chat_id: chatId,
      });
    }

    /**
     * You can also try e.g.:
     *
     * import { ChatAnthropic } from "langchain/chat_models/anthropic";
     * const model = new ChatAnthropic({});
     *
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
      temperature: 0.7,
      // modelName: "gpt-4-0125-preview",
      modelName: "gpt-3.5-turbo-1106",
      streaming: true,
    });

    const outputParser = new HttpResponseOutputParser();

    const symptomReviewerChain = RunnableSequence.from([
      PromptTemplate.fromTemplate(SYMPTOM_REVIEWER),
      model,
      new StringOutputParser(),
    ]);

    const historyReviewerChain = RunnableSequence.from([
      PromptTemplate.fromTemplate(HISTORY_REVIEWER),
      model,
      new StringOutputParser(),
    ]);

    // const symptomPrompt = PromptTemplate.fromTemplate(SYMPTOM_TEMPLATE)
    //   .pipe(model)
    //   .pipe(outputParser);
    // const historyPrompt = PromptTemplate.fromTemplate(HISTORY_TEMPLATE)
    //   .pipe(model)
    //   .pipe(outputParser);
    const symptomPrompt = PromptTemplate.fromTemplate(
      SYMPTOM_PROMPT_FROM_REVIEW
    )
      .pipe(model)
      .pipe(outputParser);
    const historyPrompt = PromptTemplate.fromTemplate(
      HISTORY_PROMPT_FROM_REVIEW
    )
      .pipe(model)
      .pipe(outputParser);
    const finalPrompt = PromptTemplate.fromTemplate(FINAL_TEMPLATE)
      .pipe(model)
      .pipe(outputParser);

    // invoke the symptom reviewer chain
    const symptomReviewerResult = await symptomReviewerChain.invoke({
      chat_history: formattedUserOnlyMessages.join("\n"),
      input: currentMessageContent,
    });

    console.log("SYMPTOM REVIEWER RESULT", symptomReviewerResult);

    if (symptomReviewerResult.toLowerCase().includes("prompt_user")) {
      const stream = await symptomPrompt.stream(
        {
          // chat_history: formattedPreviousMessages.join("\n"),
          expert_conversation: symptomReviewerResult,
          input: currentMessageContent,
        },
        {
          callbacks: [
            {
              handleChainEnd(outputs, runId, parentRunId) {
                if (!parentRunId) {
                  data.close();
                }
              },
              handleLLMEnd: async (res) => {
                await handleResponse(
                  res,
                  chatId,
                  messages,
                  currentMessageContent,
                  token
                );
              },
            },
          ],
        }
      );

      return new StreamingTextResponse(
        stream.pipeThrough(createStreamDataTransformer(true)),
        {},
        data
      );
    } else {
      // next step is history branch
      // const historyBranch = RunnableBranch.from([
      //   [
      //     (x: {
      //       topic: string;
      //       input: string;
      //       chat_history: string;
      //       user_messages: string;
      //     }) => {
      //       return x.topic.toLowerCase().includes("prompt_user");
      //     },
      //     historyPrompt,
      //   ],
      //   finalPrompt,
      // ]);
      const historyBranch = RunnableBranch.from([
        [
          (x: {
            topic: string;
            input: string;
            chat_history: string;
            expert_conversation: string;
            user_messages: string;
          }) => {
            return x.topic.toLowerCase().includes("prompt_user");
          },
          historyPrompt,
        ],
        finalPrompt,
      ]);

      // const fullChain = RunnableSequence.from([
      //   {
      //     topic: historyReviewerChain,
      //     input: (x: {
      //       chat_history: string;
      //       input: string;
      //       user_messages: string;
      //     }) => x.input,
      //     chat_history: (x: {
      //       chat_history: string;
      //       input: string;
      //       user_messages: string;
      //     }) => x.chat_history,
      //     user_messages: (x: {
      //       chat_history: string;
      //       input: string;
      //       user_messages: string;
      //     }) => x.user_messages,
      //   },
      //   historyBranch,
      // ]);
      const fullChain = RunnableSequence.from([
        {
          topic: historyReviewerChain,
          expert_conversation: historyReviewerChain,
          input: (x: {
            chat_history: string;
            input: string;
            user_messages: string;
          }) => x.input,
          chat_history: (x: {
            chat_history: string;
            input: string;
            user_messages: string;
          }) => x.chat_history,
          user_messages: (x: {
            chat_history: string;
            input: string;
            user_messages: string;
          }) => x.user_messages,
        },
        historyBranch,
      ]);

      const stream = await fullChain.stream(
        {
          chat_history: formattedPreviousMessages.join("\n"),
          input: currentMessageContent,
          user_messages: formattedUserOnlyMessages.join("\n"),
        },
        {
          callbacks: [
            {
              handleChainEnd(outputs, runId, parentRunId) {
                if (!parentRunId) {
                  data.close();
                }
              },
              handleLLMEnd: async (res) => {
                const response = res.generations[0][0].text;
                if (
                  response.toLowerCase().includes("final_prompt") ||
                  response.toLowerCase().includes("prompt_user")
                ) {
                  // don't save review responses
                  return;
                }

                await handleResponse(
                  res,
                  chatId,
                  messages,
                  currentMessageContent,
                  token
                );
              },
            },
          ],
        }
      );

      return new StreamingTextResponse(
        stream.pipeThrough(createStreamDataTransformer(true)),
        {},
        data
      );
    }

    // const historyBranch = RunnableBranch.from([
    //   [
    //     (x: { topic: string; input: string; chat_history: string }) => {
    //       const splitTopic = x.topic.split(" ");
    //       const lastWord = splitTopic[splitTopic.length - 1];
    //       return lastWord.toLowerCase().includes("next");
    //     },
    //     historyPrompt,
    //   ],
    //   finalPrompt,
    // ]);

    // const symptomBranch = RunnableBranch.from([
    //   [
    //     (x: { topic: string; input: string; chat_history: string }) => {
    //       const splitTopic = x.topic.split(" ");
    //       const lastWord = splitTopic[splitTopic.length - 1];
    //       return lastWord.toLowerCase().includes("symptom");
    //     },
    //     symptomPrompt,
    //   ],
    //   historyBranch,
    // ]);

    // const fullChain = RunnableSequence.from([
    //   {
    //     topic: symptomReviewerChain,
    //     input: (x: { chat_history: string; input: string }) => x.input,
    //     chat_history: (x: { chat_history: string; input: string }) =>
    //       x.chat_history,
    //   },
    //   symptomBranch,
    // ]);

    // const stream = await fullChain.stream(
    //   {
    //     chat_history: formattedPreviousMessages.join("\n"),
    //     input: currentMessageContent,
    //   },
    //   {
    //     callbacks: [
    //       {
    //         handleChainEnd(outputs, runId, parentRunId) {
    //           // check that main chain (without parent) is finished:
    //           if (!parentRunId) {
    //             data.close();
    //           }
    //         },
    //         handleLLMEnd: async (res) => {
    //           const splitGeneration = res.generations[0][0].text.split(" ");
    //           const lastWord = splitGeneration[splitGeneration.length - 1];

    //           if (CATEGORIES.has(lastWord.toLowerCase())) {
    //             // if response is final, generate report for doctor and archive chat
    //             return;
    //           }

    //           await Promise.all([
    //             fetchMutation(
    //               api.chat.createMessage,
    //               {
    //                 chat_id: chatId as Id<"chat">,
    //                 content: currentMessageContent,
    //                 role: "user",
    //                 index: messages.length - 1,
    //               },
    //               {
    //                 token,
    //               }
    //             ),
    //             fetchMutation(
    //               api.chat.createMessage,
    //               {
    //                 chat_id: chatId as Id<"chat">,
    //                 content: res.generations?.[0][0].text,
    //                 role: "assistant",
    //                 index: messages.length,
    //               },
    //               {
    //                 token,
    //               }
    //             ),
    //           ]);
    //         },
    //       },
    //     ],
    //   }
    // );

    // return new StreamingTextResponse(
    //   stream.pipeThrough(createStreamDataTransformer(true)),
    //   {},
    //   data
    // );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
