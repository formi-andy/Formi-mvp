"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { renderCases } from "./RenderCases";
import NoCases from "./NoCases";

const PatientCaseGallery: React.FC = () => {
  let medicalCasesByDate = useQuery(api.medical_case.listMedicalCasesByUser, {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return (
    <div className="w-full flex flex-col border rounded-lg p-4 lg:p-8 gap-4">
      {renderCases({
        cases: medicalCasesByDate,
        title: "Cases",
        emptyComponent: <NoCases />,
      })}
    </div>
  );
};

export default PatientCaseGallery;
