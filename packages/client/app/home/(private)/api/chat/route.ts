// TODO: move to python serverless runtime when stable

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { Client } from "langsmith";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { auth } from "@clerk/nextjs";

import { DynamicTool } from "@langchain/core/tools";
import {
  Runnable,
  RunnableBranch,
  RunnableSequence,
} from "@langchain/core/runnables";
import {
  AgentExecutor,
  createOpenAIFunctionsAgent,
  type AgentStep,
  RunnableAgent,
  createReactAgent,
} from "langchain/agents";
import { MultiPromptChain } from "langchain/chains";

import { nanoid } from "@/lib/utils";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
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

All responses must be respectful.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const HISTORY_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You are now asking about their medical history, including any past surgeries, medications, and allergies.
Do this briefly and respectfully, and remember to ask open-ended questions to get the most information.

All responses must be respectful.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const FINAL_TEMPLATE = `You are a health assistant named Formi tasked with gathering user medical information with questions for their doctor to review later.
You have now gathered enough information about the user's symptoms and medical history.
You will now let the user know that you have enough information and then thank them for their time. Tell them that
if they have any other concerns or questions, they can put them in the chat.

All responses must be respectful.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const REVIEWER = `You are tasked with classifying if a conversation has enough information for a doctor to review later.
You will check if the user has provided enough information about their symptoms and enough information about their medical history related to their condition.
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

If the user has not provided enough information about their symptoms, you will respond with \`symptom\`.
If the user has not provided enough information about their medical history, you will respond with \`history\`.
If the user has provided enough information about their symptoms and history, you will respond with \`final\`.

Do not respond with more than one word.

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
    // const chain = symptomPrompt.pipe(model).pipe(outputParser);

    const classificationChain = RunnableSequence.from([
      PromptTemplate.fromTemplate(REVIEWER),
      model,
      new StringOutputParser(),
    ]);

    const classificationChainResult = await classificationChain.invoke({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });
    console.log("CLASSIFICATION", classificationChainResult);

    const symptomPrompt = PromptTemplate.fromTemplate(TEMPLATE)
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
        (x: { topic: string; input: string; chat_history: string }) =>
          x.topic.toLowerCase().includes("symptom"),
        symptomPrompt,
      ],
      [
        (x: { topic: string; input: string; chat_history: string }) =>
          x.topic.toLowerCase().includes("history"),
        historyPrompt,
      ],
      finalPrompt,
    ]);

    try {
      const fullChain = RunnableSequence.from([
        {
          topic: classificationChain,
          input: (x: { chat_history: string; input: string }) => x.input,
          chat_history: (x: { chat_history: string; input: string }) =>
            x.chat_history,
          // topic: classificationChain,
          // input: currentMessageContent,
          // chatHistory: formattedPreviousMessages.join("\n"),
        },
        branch,
      ]);

      // const multiChain = MultiPromptChain.fromLLMAndPrompts(model, {
      //   promptNames: ["symptoms", "history", "final"],
      //   promptDescriptions: [
      //     "When there isn't enough information about the symptoms",
      //     "When there isn't enough information about the history",
      //     "When there is enough information about the symptoms and history",
      //   ],
      //   promptTemplates: [symptomPrompt, historyPrompt, finalPrompt],
      // });

      console.log("RUNNING FULL CHAIN");

      const stream = await fullChain.stream(
        {
          chat_history: formattedPreviousMessages.join("\n"),
          input: currentMessageContent,
        },
        {
          callbacks: [
            {
              handleLLMEnd: async (res) => {
                if (res.generations[0][0].text.split(" ").length === 1) {
                  // if response is final, archive chat afterwards
                  return;
                }

                console.log("RES", res.generations[0]);
                const title = json.messages[0].content.substring(0, 100);
                const id = json.id ?? nanoid();
                const createdAt = Date.now();
                const path = `/chat/${id}`;
                const payload = {
                  id,
                  title,
                  userId,
                  createdAt,
                  path,
                  messages: [
                    ...messages,
                    {
                      content: res.generations?.[0][0].text,
                      role: "assistant",
                    },
                  ],
                };
                await kv.hmset(`chat:${id}`, payload);
                await kv.zadd(`user:chat:${userId}`, {
                  score: createdAt,
                  member: `chat:${id}`,
                });
              },
            },
          ],
        }
      );

      return new StreamingTextResponse(stream);
    } catch (e: any) {
      console.log("ERROR", e);

      return NextResponse.json(
        { error: e.message },
        { status: e.status ?? 500 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
