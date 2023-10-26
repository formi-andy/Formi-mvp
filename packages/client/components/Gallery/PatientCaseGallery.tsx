"use client";

import { useQuery } from "convex/react";
import { Skeleton } from "antd";

import { api } from "@/convex/_generated/api";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "../ui/button";
import CaseRow from "./Case/CaseRow";
import NoCases from "./NoCases";

const PatientCaseGallery: React.FC = () => {
  let medicalCasesByDate = useQuery(api.medical_case.listMedicalCases, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const toast = useNetworkToasts();

  const renderCases = () => {
    if (medicalCasesByDate === undefined) {
      return (
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
      );
    }

    if (medicalCasesByDate.length === 0) {
      return <NoCases />;
    }

    return medicalCasesByDate.map(({ date, medicalCases }) => {
      return <CaseRow date={date} medicalCases={medicalCases} />;
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-xl lg:text-2xl font-medium">Cases</p>
      </div>
      {renderCases()}
    </>
  );
};

export default PatientCaseGallery;
