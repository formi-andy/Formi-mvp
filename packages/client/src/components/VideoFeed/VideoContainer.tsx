"use client";

import ZoomVideo from "@zoom/videosdk";
import ZoomContext from "@/context/zoom-context";
import VideoFeed from "./VideoFeed";
import { devConfig } from "@/config/dev";
import { b64DecodeUnicode, generateVideoToken } from "@/utils/util";

const zmClient = ZoomVideo.createClient();

export default function VideoContainer({
  meetingId,
  joined,
}: {
  meetingId: string;
  joined: boolean;
}) {
  let meetingArgs: any = Object.fromEntries(
    new URLSearchParams(location.search)
  );
  // Add enforceGalleryView to turn on the gallery view without SharedAddayBuffer
  if (
    !meetingArgs.sdkKey ||
    !meetingArgs.topic ||
    !meetingArgs.name ||
    !meetingArgs.signature
  ) {
    // meetingArgs = { ...devConfig, ...meetingArgs };
    meetingArgs.enforceGalleryView = true;
  }

  if (meetingArgs.web) {
    if (meetingArgs.topic) {
      try {
        meetingArgs.topic = b64DecodeUnicode(meetingArgs.topic);
      } catch (e) {}
    } else {
      meetingArgs.topic = "";
    }

    if (meetingArgs.name) {
      try {
        meetingArgs.name = b64DecodeUnicode(meetingArgs.name);
      } catch (e) {}
    } else {
      meetingArgs.name = "";
    }

    if (meetingArgs.password) {
      try {
        meetingArgs.password = b64DecodeUnicode(meetingArgs.password);
      } catch (e) {}
    } else {
      meetingArgs.password = "";
    }

    if (meetingArgs.sessionKey) {
      try {
        meetingArgs.sessionKey = b64DecodeUnicode(meetingArgs.sessionKey);
      } catch (e) {}
    } else {
      meetingArgs.sessionKey = "";
    }

    if (meetingArgs.userIdentity) {
      try {
        meetingArgs.userIdentity = b64DecodeUnicode(meetingArgs.userIdentity);
      } catch (e) {}
    } else {
      meetingArgs.userIdentity = "";
    }

    if (meetingArgs.role) {
      meetingArgs.role = parseInt(meetingArgs.role, 10);
    } else {
      meetingArgs.role = 1;
    }
  }

  if (!meetingArgs?.cloud_recording_option) {
    meetingArgs.cloud_recording_option = "0";
  }
  if (!meetingArgs?.cloud_recording_election) {
    meetingArgs.cloud_recording_election = "";
  }

  if (!meetingArgs.signature && meetingArgs.sdkSecret && meetingId !== "") {
    meetingArgs.signature = generateVideoToken(
      meetingArgs.sdkKey,
      meetingArgs.sdkSecret,
      meetingId,
      meetingArgs.password,
      meetingArgs.sessionKey,
      meetingArgs.userIdentity,
      parseInt(meetingArgs.role, 10),
      meetingArgs.cloud_recording_option,
      meetingArgs.cloud_recording_election
    );

    const urlArgs = {
      topic: meetingArgs.topic,
      name: meetingArgs.name,
      password: meetingArgs.password,
      sessionKey: meetingArgs.sessionKey,
      userIdentity: meetingArgs.userIdentity,
      role: meetingArgs.role || 1,
      cloud_recording_option: meetingArgs.cloud_recording_option,
      cloud_recording_election: meetingArgs.cloud_recording_election,
      web: "1",
    };
  }

  return (
    <ZoomContext.Provider value={zmClient}>
      <VideoFeed
        meetingArgs={
          {
            ...meetingArgs,
            topic: meetingId,
            joined,
          } as any
        }
      />
    </ZoomContext.Provider>
  );
}
