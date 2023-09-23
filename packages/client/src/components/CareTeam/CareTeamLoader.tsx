import { Skeleton } from "antd";
import { CARE_TEAM_LOADERS } from "@/commons/constants/loaders";

export default function CareTeamLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[...Array(CARE_TEAM_LOADERS)].map((_, index) => {
        return (
          <div className="flex gap-x-4 border rounded-lg items-center p-4">
            <Skeleton.Avatar active size={32} />
            <div className="flex flex-col w-full h-11 justify-center gap-y-1.5">
              <div className="w-3/5 h-[18px]">
                <Skeleton.Button className="!w-full !h-full" active />
              </div>
              <div className="w-full h-[14px]">
                <Skeleton.Button className="!w-full !h-full" active />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
