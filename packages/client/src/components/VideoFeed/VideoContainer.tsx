"use client";

import ZoomVideo from "@zoom/videosdk";
import ZoomContext from "@/context/zoom-context";
import VideoFeed from "./VideoFeed";
import { devConfig } from "@/config/dev";
import axios from "axios";
import { useEffect, useState } from "react";

const zmClient = ZoomVideo.createClient();

export default function VideoContainer({
  meetingId,
  joined,
}: {
  meetingId: string;
  joined: boolean;
}) {
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (!joined) return;

    getSignature();

    async function getSignature() {
      const res = await axios.post("/api/auth/video-signature", {
        meetingId,
        password: "",
        sessionKey: "",
        userIdentity: "",
        cloudRecordingOption: "",
        cloudRecordingElection: "",
        role: "",
      });
      setSignature(res.data.signature);
    }
  }, [meetingId]);

  return (
    <ZoomContext.Provider value={zmClient}>
      <VideoFeed
        meetingArgs={
          {
            ...devConfig,
            topic: meetingId,
            signature,
            joined,
          } as any
        }
      />
    </ZoomContext.Provider>
  );
}
