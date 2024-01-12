import * as amplitude from "@amplitude/analytics-browser";

export const initAmplitude = () => {
  let key = "";
  if (process.env.NODE_ENV === "production") {
    key = process.env.NEXT_PUBLIC_AMPLITUDE_PROD_KEY || "";
  } else {
    key = process.env.NEXT_PUBLIC_AMPLITUDE_DEV_KEY || "";
  }

  amplitude.init(key, {
    defaultTracking: {
      attribution: false,
      pageViews: true,
      sessions: true,
      formInteractions: true,
      fileDownloads: false,
    },
  });
};
