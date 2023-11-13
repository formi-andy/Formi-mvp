import { Instructions } from "@/components/Record/Instructions/Instructions";
import Meeting from "@/components/Record/VideoFeed/Meeting";

type Props = {};

const Record = (props: Props) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Instructions />
      <Meeting />
    </div>
  );
};

export default Record;
