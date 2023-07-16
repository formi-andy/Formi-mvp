"use client";

import { useState } from "react";
import VideoContainer from "./VideoContainer";
import { TextInput } from "@mantine/core";
import { message } from "antd";
import { useSession } from "next-auth/react";

export default function Meeting() {
  const [joined, setJoined] = useState(false);
  const [meetingID, setMeetingID] = useState("");

  return (
    <div className="flex flex-col w-full items-center">
      {!joined ? (
        <div className="flex flex-col items-center w-[400px]">
          <p className="text-2xl mb-2 font-light">Meeting ID</p>
          <TextInput
            classNames={{ root: "w-full" }}
            placeholder="Enter Meeting ID"
            className="mb-8"
            value={meetingID}
            onChange={(e) => setMeetingID(e.currentTarget.value)}
          />
          <button
            className="border rounded px-4 py-1"
            onClick={() => {
              if (meetingID.length > 0) {
                setJoined(true);
              } else {
                message.error("Please enter a meeting ID");
              }
            }}
          >
            Join Meeting
          </button>
        </div>
      ) : (
        <VideoContainer sessionKey={meetingID} />
      )}
    </div>
  );
}
