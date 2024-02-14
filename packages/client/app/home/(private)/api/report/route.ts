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
import { getAuthToken } from "@/lib/utils";

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

The format of the report should have the following four sections:
1. Patient Symptoms
2. Medical History
3. Lifestyle and Additional Information
4. Conclusion and Recommendations

Here is an example report:
**Patient Symptoms:**
- The patient is experiencing severe stomach pain, characterized as dull persistently and becoming sharp with movement. This pain is localized to the stomach area without radiation.
- The pain significantly disrupts daily activities, requiring the patient to lie down frequently.

**Medical History:**
- The patient is taking melatonin for sleep, with no other medication use reported that could be linked to the stomach pain.
- No allergies, drug, or alcohol use has been reported.
- The patient has no surgical history that could be related to the current symptoms.
- There is a family history of heart conditions, but no stomach-related issues have been reported in the family.

**Lifestyle and Additional Information:**
- No additional symptoms like nausea, vomiting, or changes in bowel habits accompany the stomach pain.
- Movement has been identified as a factor that worsens the pain, but no other specific triggers have been noted.

**Conclusion and Recommendations:**
The absence of additional symptoms and the lack of medication side effects or relevant surgical history necessitate further medical evaluation and diagnostic testing to uncover the root cause of the stomach pain. The patient is advised to seek medical attention promptly for a comprehensive examination and to formulate an appropriate treatment plan. This approach aims to identify potential gastrointestinal issues or other internal conditions that may be causing the pain.

Expert conversation:
{expert_conversation}

Report:`;

export const runtime = "edge";

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
      // modelName: "gpt-3.5-turbo-1106", // CHANGE BACK TO 4 WHEN LIVE
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
