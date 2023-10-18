import { formatBytes } from "@/utils/formatBytes";
import { TextInput } from "@mantine/core";
import { Button } from "../ui/button";
import { LuTrash } from "react-icons/lu";

export default function AcceptedFiles({
  data,
  setData,
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
}) {
  const listedFiles = data.map((d, index) => (
    <div key={d.file.name} className="flex flex-col gap-y-2">
      <p className="truncate max-w-[calc(100vw-56px)] sm:max-w-[calc(60vw-64px)]">
        {d.file.name} - {formatBytes(d.file.size)} bytes
      </p>
      <div className="flex w-full items-center gap-x-4">
        <TextInput
          className="flex-1"
          placeholder="Title"
          value={d.title}
          onChange={(e) => {
            const newData = [...data];
            newData[index].title = e.target.value;
            setData(newData);
          }}
        />
        <Button
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
    <div className="flex flex-col gap-y-2 mt-4">
      <p className="text-lg font-medium border-b pb-2">Accepted Files</p>
      {listedFiles.length === 0 ? (
        <p>No accepted file(s)</p>
      ) : (
        <ul className="w-full flex flex-col gap-y-2">{listedFiles}</ul>
      )}
    </div>
  );
}
