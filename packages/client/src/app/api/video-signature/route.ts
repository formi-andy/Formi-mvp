import authMiddleware from "@/utils/authMiddleware";
import { generateVideoToken } from "@/utils/util";

type Payload = {
  meetingId: string;
  password: string;
  sessionKey: string;
  userIdentity: string;
  cloudRecordingOption: string;
  cloudRecordingElection: string;
  role: string;
};

export async function POST(request: Request) {
  const session = await authMiddleware();
  // get user role from middleware
  const requestData: Payload = await request.json();

  let signature = generateVideoToken(
    process.env.ZOOM_MEETING_SDK_KEY || "",
    process.env.ZOOM_MEETING_SDK_SECRET || "",
    requestData.meetingId,
    requestData.password,
    requestData.sessionKey,
    requestData.userIdentity,
    parseInt(requestData.role || "1", 10),
    requestData.cloudRecordingOption,
    requestData.cloudRecordingElection
  );

  return new Response(JSON.stringify({ signature }), {
    headers: { "Content-Type": "application/json" },
  });
}
