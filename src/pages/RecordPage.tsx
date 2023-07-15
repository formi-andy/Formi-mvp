import React from "react";
import { Instructions, VideoFeed, CaptureButton } from "../components";

type Props = {};

const Record = (props: Props) => {
  return (
    <div>
      <Instructions />
      <VideoFeed />
      <CaptureButton />
    </div>
  );
};

export default Record;
