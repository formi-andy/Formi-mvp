import { formatBytes } from "@/utils/formatBytes";
import { Button } from "../button";
import { LuTrash } from "react-icons/lu";

export default function AcceptedFiles({
  data,
  setData,
  bgColor = "bg-lightblue",
  textColor = "text-white",
}: {
  data: {
    file: File;
    title: string;
  }[];
  setData: (
    data: {
      file: File;
      title: string;
    }[]
  ) => void;
  bgColor?: string;
  textColor?: string;
}) {
  const listedFiles = data.map((d, index) => (
    <div key={d.file.name} className="flex flex-col gap-y-2">
      <div className="flex w-full items-center gap-x-4">
        {/* <p className="w-full truncate"> */}
        <p className="truncate w-full">
          {d.file.name} - {formatBytes(d.file.size)} bytes
        </p>
        <Button
          className={`text-black ${bgColor}`}
          variant="outline-danger"
          size="icon"
          onClick={() => {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
          }}
        >
          <LuTrash size={20} />
        </Button>
      </div>
    </div>
  ));
  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-lg font-medium text-white">Accepted Files</p>
      {listedFiles.length === 0 ? (
        <p className={`${textColor}`}>No accepted file(s)</p>
      ) : (
        <ul className={`w-full flex flex-col gap-y-2 ${textColor}`}>
          {listedFiles}
        </ul>
      )}
    </div>
  );
}
