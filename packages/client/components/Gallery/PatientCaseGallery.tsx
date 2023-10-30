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
    <>
      {renderCases({
        cases: medicalCasesByDate,
        title: "Cases",
        emptyComponent: <NoCases />,
      })}
    </>
  );
};

export default PatientCaseGallery;
