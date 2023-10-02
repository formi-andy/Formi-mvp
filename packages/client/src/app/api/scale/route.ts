import axios from "axios";
import dayjs from "dayjs";

export async function POST(request: Request) {
  const blob = await request.blob();

  const patientId = new URL(request.url).searchParams.get("patientId");
  const title = new URL(request.url).searchParams.get("title")!;
  const storageId = new URL(request.url).searchParams.get("storageId")!;

  const url = "https://api.scale.com/v1/files/upload";

  const formData = new FormData();
  formData.append("project_name", "Ear Infection Image Classification");
  formData.append("display_name", title);
  formData.append("reference_id", storageId);
  formData.append("metadata", JSON.stringify({ patientId, storageId }));
  formData.append("file", blob, title);

  const { data } = await axios.post(url, formData, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${process.env.SCALE_API_KEY}`,
    },
  });

  const batchName = `Ear Infection Image Classification - ${Date.now()}`;

  await axios.post(
    "https://api.scale.com/v1/batches",
    {
      project: "Ear Infection Image Classification",
      name: batchName,
      callback: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/scale-callback`,
      calibration_batch: false,
      self_label_batch: true,
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
      title: `Ear Infection Image Classification - ${dayjs().format(
        "M/DD/YYYY"
      )}`,
      batch: batchName,
      responses_required: 1,
      metadata: {
        patientId,
        storageId,
      },
      callback_url: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/scale-callback`,
      attachments: [
        {
          type: "image",
          content: data.attachment_url,
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
