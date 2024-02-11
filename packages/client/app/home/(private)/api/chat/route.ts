// TODO: move to python serverless runtime when stable

import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Client } from "langsmith";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { auth } from "@clerk/nextjs";

import { nanoid } from "@/lib/utils";

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

After the user has provided enough information about their symptoms, you will ask about their medical history, including any past surgeries, medications, and allergies.
Do this briefly and empathetically, and remember to ask open-ended questions to get the most information.

All responses must be empathetic, respectful, and humane.

Current conversation:
{chat_history}

User: {input}
Formi:`;

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
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

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
    const chain = prompt.pipe(model).pipe(outputParser);

    console.log("RUNNING CHAIN");

    const stream = await chain.stream(
      {
        chat_history: formattedPreviousMessages.join("\n"),
        input: currentMessageContent,
      },
      {
        callbacks: [
          {
            handleLLMEnd: async (res) => {
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
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
