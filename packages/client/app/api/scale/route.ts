import axios from "axios";
import dayjs from "dayjs";

type Payload = {
  attachments: (string | null)[];
  instructions: string;
};

export async function POST(request: Request) {
  // const patientId = new URL(request.url).searchParams.get("patientId");
  // const title = new URL(request.url).searchParams.get("title")!;
  // const storageId = new URL(request.url).searchParams.get("storageId")!;
  const caseId = new URL(request.url).searchParams.get("caseId")!;
  const instructions = new URL(request.url).searchParams.get("instructions")!;
  // const batchName = new URL(request.url).searchParams.get("batchName");

  const requestData: Payload = await request.json();

  const filteredAttachments = requestData.attachments.filter(
    (attachment) => attachment !== null
  );

  // const url = "https://api.scale.com/v1/files/upload";

  // const formData = new FormData();
  // formData.append("project_name", "Ear Infection Image Classification");
  // formData.append("display_name", title);
  // formData.append("reference_id", storageId);
  // formData.append("metadata", JSON.stringify({ patientId, storageId }));
  // formData.append("file", blob, title);

  // const { data } = await axios.post(url, formData, {
  //   headers: {
  //     Accept: "application/json",
  //     Authorization: `Basic ${process.env.SCALE_API_KEY}`,
  //   },
  // });

  const batchName = `Homescope Batch - ${Date.now()}`;

  await axios.post(
    "https://api.scale.com/v1/batches",
    {
      project: "Homescope",
      name: batchName,
      //   callback: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/scale-callback`,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.SCALE_API_KEY}`,
      },
    }
  );

  await axios.post(
    "https://api.scale.com/v1/task/textcollection",
    {
      title: `Case Classification - ${dayjs().format("M/DD/YYYY")}`,
      batch: batchName,
      responses_required: 5,
      metadata: {
        caseId,
      },
      unique_id: caseId,
      callback_url: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/scale-callback`,
      attachments: filteredAttachments.map((attachment) => ({
        type: "image",
        content: attachment,
      })),
      instruction: requestData.instructions,
      fields: [
        {
          type: "text",
          field_id: "diagnosis",
          title: "Diagnosis",
          min_responses_required: 1,
          max_responses_required: 1,
          max_characters: 2000,
          required: true,
          hint: "Please enter the diagnosis for this case. Use your best judgement, remember that this is purely for training and research purposes.",
        },
      ],
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.SCALE_API_KEY}`,
      },
    }
  );

  await axios.post(
    `https://api.scale.com/v1/batches/${batchName}/finalize`,
    {},
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.SCALE_API_KEY}`,
      },
    }
  );

  return new Response(null, {
    headers: { "Content-Type": "application/json" },
  });
}
