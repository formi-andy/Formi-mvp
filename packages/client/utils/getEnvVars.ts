export const isProd = process.env.NODE_ENV === "production";

export const r2WorkerEndpoints =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_CLOUD_FLARE_WORKER_PROD
    : process.env.NEXT_PUBLIC_CLOUD_FLARE_WORKER_DEV;
