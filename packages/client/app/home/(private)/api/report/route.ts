import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const REPORT_TEMPLATE = `You are a health assistant named Formi tasked with generating a report for a doctor based off of the current conversation which 
has details about the user's symptoms and medical history.

The report must be accurate based on the conversation.

Current conversation:
{chat_history}

User: {input}
Formi:`;

const TOT_REPORT = `Imagine three different experts tasked with generating a report for a doctor based off of the current conversation which
has details about the user's symptoms and medical history.
All experts will write down 1 step of their thinking, then share it with the group.
Then all experts will go on to the next step, etc. If any expert realises they're wrong at any point then they leave.

Finally, the group will decide if the report is accurate based on the conversation.

The report must be accurate based on the conversation.

Current conversation:
{chat_history}
Last user message: {input}

Report:`;

export const runtime = "edge";

export async function getAuthToken() {
  return (await auth().getToken({ template: "convex" })) ?? undefined;
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

    const authToken = await getAuthToken();

    // return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
