import { Skeleton } from "antd";
import { LuEye } from "react-icons/lu";

export default function PatientInviteLoader() {
  return (
    <div className="p-4 flex justify-between w-full items-center border-t">
      <div className="flex flex-col">
        <div className="flex whitespace-pre-wrap items-center">
          <p className="font-medium">Sent on </p>
          <div className="h-[20px] w-44">
            <Skeleton.Button className="!w-full !h-full" active />
          </div>
        </div>
        <div className="flex gap-x-2 items-center mt-1 h-6">
          <div className="p-1 hover:bg-slate-50 transition">
            <p className="text-sm">
              <LuEye />
            </p>
          </div>
          <div className="h-[14px] w-32">
            <Skeleton.Button className="!w-full !h-full" active />
          </div>
        </div>
      </div>
      <button className="border h-10 px-3 rounded-lg flex items-center justify-center border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
        Cancel
      </button>
    </div>
  );
}
