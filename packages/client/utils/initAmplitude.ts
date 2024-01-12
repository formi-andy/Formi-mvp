import * as amplitude from "@amplitude/analytics-browser";

export const initAmplitude = () => {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || "");
};
