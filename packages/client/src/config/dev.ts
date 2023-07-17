export const devConfig = {
  sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
  sdkSecret: process.env.ZOOM_MEETING_SDK_SECRET,
  webEndpoint: "zoom.us",
  topic: "React Demo",
  name: `React`,
  password: "",
  signature: "",
  sessionKey: "",
  userIdentity: "",
  // role = 1 to join as host, 0 to join as attendee. The first user must join as host to start the session
  role: 1,
};
