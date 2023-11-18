import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import CaseCard from "./CaseCard";
import { useUser } from "@clerk/nextjs";
import { UserRole } from "@/types/role-types";

type Props = {
  date: any;
  medicalCases: any[];
  renderCaseComponent?: (medicalCase: any) => React.ReactNode;
};

const CaseRow = ({ date, medicalCases, renderCaseComponent }: Props) => {
  const user = useUser();

  return (
    <div key={date} className="flex flex-col gap-y-2">
      <p className="text-lg lg:text-xl font-medium">
        {dayjs(date).format("M/DD/YYYY")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {medicalCases.map((medicalCase) => {
          return (
            <div
              className="flex flex-col relative cursor-pointer"
              key={medicalCase._id}
            >
              {renderCaseComponent ? (
                renderCaseComponent(medicalCase)
              ) : (
                <Link
                  href={
                    user.user?.publicMetadata.role === UserRole.MedicalStudent
                      ? `/case/${medicalCase._id}/review`
                      : `/case/${medicalCase._id}`
                  }
                >
                  <CaseCard
                    medicalCase={medicalCase}
                    type={
                      user.user?.publicMetadata.role === UserRole.MedicalStudent
                        ? UserRole.MedicalStudent
                        : UserRole.Patient
                    }
                  />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseRow;
