import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  experimental_StreamData,
  createStreamDataTransformer,
} from "ai";

import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const REPORT_TEMPLATE = `You are a health assistant named Formi tasked with generating a report for a doctor based off of the current conversation which 
has details about the user's symptoms and medical history.

The report must be accurate based on the conversation.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const SELF_REPORT = ``;

const TOT_REPORT = `Imagine three different experts tasked with generating a summary for a doctor based off of the current conversation which
has details about the user's symptoms and medical history.
All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave.

The report must be accurate based on the conversation.

Current conversation:
{chat_history}

Report:`;

const EXTRACT_REPORT = `Three experts have generated a summary for a doctor based off of the current conversation which has details about the user's symptoms and medical history. 
You're job is to extract it from the conversation.

Expert conversation:
{expert_conversation}

Report:`;

export const runtime = "edge";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
}

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { chat_id, messages } = json;
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    console.log("ID", chat_id);

    const formattedMessages = messages.map(formatMessage);
    const token = await getAuthToken();

    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4-0125-preview",
      // modelName: "gpt-3.5-turbo-1106",
      streaming: true,
    });

    const outputParser = new HttpResponseOutputParser();

    const totChain = PromptTemplate.fromTemplate(TOT_REPORT)
      .pipe(model)
      .pipe(new StringOutputParser());

    const fullChain = RunnableSequence.from([
      {
        expert_conversation: totChain,
      },
      PromptTemplate.fromTemplate(EXTRACT_REPORT),
      model,
      new StringOutputParser(),
    ]);

    const response = await fullChain.invoke({
      chat_history: formattedMessages.join("\n"),
    });

    await fetchMutation(
      api.chat.createReport,
      {
        chat_id: chat_id as Id<"chat">,
        content: response,
      },
      {
        token,
      }
    );

    return NextResponse.json({ report: response });

    // TODO: figure out how to stream and add to chat later
    // const stream = await fullChain.stream({
    //   chat_history: formattedMessages.join("\n"),
    // });

    // return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
