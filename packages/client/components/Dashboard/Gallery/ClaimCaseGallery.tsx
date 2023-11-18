"use client";

import { useState } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import NoPendingCases from "./NoPendingCases";
import ClaimCaseCard from "./Case/ClaimCaseCard";
import ClaimCaseModal from "./Case/ClaimCaseModal";
import { renderCases } from "./RenderCases";
import { ReviewStatus } from "@/types/review-types";
import AppLoader from "@/components/Loaders/AppLoader";
import Link from "next/link";

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

  const currentReviewCase = useQuery(api.review.getReviewsByUserAndStatus, {
    status: ReviewStatus.Created,
  });

  if (currentReviewCase === undefined) {
    return <AppLoader />;
  }

  if (currentReviewCase.length > 0) {
    return (
      <div className="flex flex-col items-center h-[calc(100vh_-_160px)] justify-center">
        <Link
          className="flex flex-col gap-y-8"
          href={`/case/${currentReviewCase[0].case_id}/review`}
        >
          <ClaimCaseCard
            medicalCase={currentReviewCase[0].medicalCase}
            setOpened={setOpened}
            setCaseData={setCaseData}
          />
          <p className="text-3xl font-light">
            You are currently reviewing this case
          </p>
        </Link>
      </div>
    );
  }

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
