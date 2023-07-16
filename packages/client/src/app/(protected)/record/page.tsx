import { CaptureButton } from "@/components/CaptureButton/CaptureButton";
import { Instructions } from "@/components/Instructions/Instructions";
import VideoContainer from "@/components/VideoFeed/VideoContainer";

type Props = {};

const Record = (props: Props) => {
  return (
    <div>
      <Instructions />
      <VideoContainer />
      <CaptureButton />
    </div>
  );
};

export default Record;
