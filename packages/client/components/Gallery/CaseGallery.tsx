"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PatientCaseGallery from "./PatientCaseGallery";
import DoctorCaseGallery from "./DoctorCaseGallery";

const CaseGallery: React.FC = () => {
  const user = useQuery(api.users.currentUser);

  return (
    <>
      {user?.role === "patient" ? (
        <PatientCaseGallery />
      ) : (
        <DoctorCaseGallery />
      )}
    </>
  );
};

export default CaseGallery;
