"use client";

import { useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import NoPendingCases from "./NoPendingCases";
import ClaimCaseCard from "./Case/ClaimCaseCard";
import ClaimCaseModal from "./Case/ClaimCaseModal";
import { renderCases } from "./RenderCases";

const ClaimCaseGallery: React.FC = () => {
  const medicalCasesByDate = useQuery(
    api.medical_case.listClaimableMedicalCases,
    {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  );

  const [opened, setOpened] = useState(false);
  const [caseData, setCaseData] = useState({
    id: "",
    title: "",
    chiefComplaint: "",
    pay: 5,
    duration: 5,
  });

  return (
    <>
      {renderCases({
        emptyComponent: <NoPendingCases />,
        cases: medicalCasesByDate,
        renderCaseComponent: (medicalCase) => (
          <ClaimCaseCard
            medicalCase={medicalCase}
            setOpened={setOpened}
            setCaseData={setCaseData}
          />
        ),
      })}
      <ClaimCaseModal
        opened={opened}
        setOpened={setOpened}
        caseData={caseData}
      />
    </>
  );
};

export default ClaimCaseGallery;
