"use client";

import { useState } from "react";
import VideoContainer from "./VideoContainer";
import { TextInput } from "@mantine/core";
import { message } from "antd";

export default function Meeting() {
  const [joined, setJoined] = useState(false);
  const [meetingId, setMeetingId] = useState("");

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col items-center w-[400px]">
        <p className="text-2xl mb-2 font-light">Meeting ID</p>
        <TextInput
          disabled={joined}
          classNames={{ root: "w-full" }}
          placeholder="Enter Meeting ID"
          className="mb-8"
          value={meetingId}
          onChange={(e) => setMeetingId(e.currentTarget.value)}
        />
        <VideoContainer meetingId={meetingId} joined={joined} />
        {!joined && (
          <button
            className="border rounded px-4 py-1"
            onClick={() => {
              if (meetingId.length > 0) {
                setJoined(true);
              } else {
                message.error("Please enter a meeting ID");
              }
            }}
          >
            Join Meeting
          </button>
        )}
      </div>
    </div>
  );
}
