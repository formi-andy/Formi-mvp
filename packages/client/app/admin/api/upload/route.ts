import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  endpoint: process.env.CLOUD_FLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId:
      (process.env.NODE_ENV === "production"
        ? process.env.CLOUD_FLARE_R2_ACCESS_KEY_ID_PROD
        : process.env.CLOUD_FLARE_R2_ACCESS_KEY_ID_DEV) ?? "",
    secretAccessKey:
      (process.env.NODE_ENV === "production"
        ? process.env.CLOUD_FLARE_R2_SECRET_ACCESS_KEY_PROD
        : process.env.CLOUD_FLARE_R2_SECRET_ACCESS_KEY_DEV) ?? "",
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
          Bucket:
            (process.env.NODE_ENV === "production"
              ? process.env.CLOUD_FLARE_R2_BUCKET_PROD
              : process.env.CLOUD_FLARE_R2_BUCKET_DEV) ?? "",
          Key: `${fileName}`,
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
