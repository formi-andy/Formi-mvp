"use client";

import { useRef, useState } from "react";
import VideoContainer from "./VideoContainer";
import { TextInput } from "@mantine/core";
import { message } from "antd";
import { Button } from "../../ui/button";

export default function Meeting() {
  const [joined, setJoined] = useState(false);
  const meetingRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col items-center w-[400px]">
        <p className="text-2xl mb-2 font-medium">Meeting ID</p>
        <TextInput
          disabled={joined}
          classNames={{ root: "w-full" }}
          placeholder="Enter Meeting ID"
          className="mb-8"
          ref={meetingRef}
        />
        <VideoContainer
          meetingId={meetingRef.current?.value || ""}
          joined={joined}
        />
        {!joined && (
          <Button
            variant="outline"
            onClick={() => {
              if (
                meetingRef.current?.value &&
                meetingRef.current?.value.length > 0
              ) {
                setJoined(true);
              } else {
                message.error("Please enter a meeting ID");
              }
            }}
          >
            Join Meeting
          </Button>
        )}
      </div>
    </div>
  );
}
