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

import { getAuthToken } from "@/lib/utils";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const CATEGORIES = new Set(["symptom", "history", "final"]);

const SYMPTOM_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You will start by asking the user for their chief complaint, symptoms, and duration.
Then it is up to you to ask follow up questions. Do not to overwhelm the user with many questions asked at once. Some topics to consider include:
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

All responses must be respectful. Do not thank the user.

Current conversation:
{chat_history}

User: {input}
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

const TOT_REVIEWER = `Imagine three different experts tasked with classifying if a conversation has enough information for a doctor to review later.
The experts will check if the user has provided enough information about their symptoms and enough information about their medical history related to their condition.
Some topics to consider checking for symptoms include:
- location and radiation
- quality
- severity
- timing
- context
- modifying factors
- associated symptoms
- how the symptoms have affected the user's life

Some topics to consider checking for medical history include:
- past surgeries
- medications
- allergies
- achohol and drug use
- family history

All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave.

Finally, the group will decide if the user has provided enough information about their symptoms and history.
If the user has not provided enough information about their symptoms, the group will respond with \`symptom\`.
If the user has not provided enough information about their medical history, the group will respond with \`history\`.
If the user has provided enough information about their symptoms and history, the group will respond with \`final\`.

Current conversation:
{chat_history}
Last user message: {input}

Classification:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
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

    const client = new Client();
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
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
      modelName: "gpt-3.5-turbo-1106",
      streaming: true,
    });

    const outputParser = new HttpResponseOutputParser();

    const totChain = RunnableSequence.from([
      PromptTemplate.fromTemplate(TOT_REVIEWER),
      model,
      new StringOutputParser(),
    ]);

    const symptomPrompt = PromptTemplate.fromTemplate(SYMPTOM_TEMPLATE)
      .pipe(model)
      .pipe(outputParser);
    const historyPrompt = PromptTemplate.fromTemplate(HISTORY_TEMPLATE)
      .pipe(model)
      .pipe(outputParser);
    const finalPrompt = PromptTemplate.fromTemplate(FINAL_TEMPLATE)
      .pipe(model)
      .pipe(outputParser);

    const branch = RunnableBranch.from([
      [
        (x: { topic: string; input: string; chat_history: string }) => {
          const splitTopic = x.topic.split(" ");
          const lastWord = splitTopic[splitTopic.length - 1];
          return lastWord.toLowerCase().includes("symptom");
        },
        symptomPrompt,
      ],
      [
        (x: { topic: string; input: string; chat_history: string }) => {
          const splitTopic = x.topic.split(" ");
          const lastWord = splitTopic[splitTopic.length - 1];
          return lastWord.toLowerCase().includes("history");
        },
        historyPrompt,
      ],
      finalPrompt,
    ]);

    const fullChain = RunnableSequence.from([
      {
        topic: totChain,
        input: (x: { chat_history: string; input: string }) => x.input,
        chat_history: (x: { chat_history: string; input: string }) =>
          x.chat_history,
      },
      branch,
    ]);

    const stream = await fullChain.stream(
      {
        chat_history: formattedPreviousMessages.join("\n"),
        input: currentMessageContent,
      },
      {
        callbacks: [
          {
            handleChainEnd(outputs, runId, parentRunId) {
              // check that main chain (without parent) is finished:
              if (!parentRunId) {
                data.close();
              }
            },
            handleLLMEnd: async (res) => {
              const splitGeneration = res.generations[0][0].text.split(" ");
              const lastWord = splitGeneration[splitGeneration.length - 1];

              if (CATEGORIES.has(lastWord.toLowerCase())) {
                // if response is final, generate report for doctor and archive chat
                return;
              }

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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
