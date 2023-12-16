import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  endpoint: process.env.CLOUD_FLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUD_FLARE_R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.CLOUD_FLARE_R2_SECRET_ACCESS_KEY ?? "",
  },
  region: "auto",
});

export async function POST(request: Request) {
  const body = await request.json();

  const urls = await Promise.all(
    body.files.map(async (fileName: string) => {
      const url = await getSignedUrl(
        S3,
        new PutObjectCommand({
          Bucket: "practice-question-images",
          Key: `${body.questionHash}-${fileName}`,
        }),
        {
          expiresIn: 60 * 60, // 1h
        }
      );

      return { fileName, url };
    })
  );

  return new Response(JSON.stringify(urls), {
    headers: { "Content-Type": "application/json" },
  });
}
