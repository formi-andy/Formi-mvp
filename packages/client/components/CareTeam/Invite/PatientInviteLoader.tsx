import { Skeleton } from "antd";
import { LuEye } from "react-icons/lu";

export default function PatientInviteLoader() {
  return (
    <div className="p-4 flex w-full items-center border-t">
      <div className="flex flex-col">
        <div className="flex whitespace-pre-wrap items-center">
          <p className="font-medium">Sent on </p>
          <div className="h-[20px] w-44">
            <Skeleton.Button className="!w-full !h-full" active />
          </div>
        </div>
        <div className="flex gap-x-2 items-center mt-1 h-6">
          <div className="p-1 hover:bg-neutral-50 transition">
            <p className="text-sm">
              <LuEye />
            </p>
          </div>
          <div className="h-[14px] w-32">
            <Skeleton.Button className="!w-full !h-full" active />
          </div>
        </div>
      </div>
    </div>
  );
}
