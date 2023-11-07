import {
  AnonymizedMedicalCasesByDate,
  MedicalCasesByDate,
} from "@/types/case-types";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import { Skeleton } from "antd";
import CaseRow from "./Case/CaseRow";

type Props = {
  cases: MedicalCasesByDate | AnonymizedMedicalCasesByDate | undefined;
  title?: string;
  emptyComponent: React.ReactNode;
  renderCaseComponent?: (medicalCase: any) => React.ReactNode;
};

export const renderCases = ({
  cases,
  title,
  emptyComponent,
  renderCaseComponent,
}: Props) => {
  return (
    <div
      className={`${
        cases === undefined ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300 ease-in-out grid gap-y-4`}
    >
      {/* Skeleton Loader */}
      {cases === undefined && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[...Array(GALLERY_LOADERS)].map((_, index) => {
            return (
              <div
                key={index}
                className="min-w-[200px] aspect-square h-fit z-100"
              >
                <Skeleton.Button
                  active
                  className="!w-full !h-full min-h-[200px]"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Actual Content */}
      {cases && cases.length > 0 && (
        <div className="flex flex-col gap-y-4">
          {title && (
            <div className="flex justify-between items-center">
              <p className="text-xl lg:text-2xl font-medium">{title}</p>
            </div>
          )}
          {cases.map(({ date, medicalCases }, idx) => (
            <CaseRow
              key={`${date}-${idx}`}
              date={date}
              medicalCases={medicalCases}
              renderCaseComponent={renderCaseComponent}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {cases && cases.length === 0 && emptyComponent}
    </div>
  );
};
