import { CaptureButton } from "@/components/CaptureButton/CaptureButton";
import { Instructions } from "@/components/Instructions/Instructions";
import { VideoFeed } from "@/components/VideoFeed/VideoFeed";

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
