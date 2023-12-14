"use client";

import Image from "next/image";
import Link from "next/link";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReviewStatus } from "@/types/review-types";

import { Button } from "../ui/button";
import AppLoader from "../Loaders/AppLoader";
import ClaimCaseCard from "./Gallery/Case/ClaimCaseCard";
import Performance from "./Performance";
import style from "./doctorgallery.module.css";

export default function DashboardCases() {
  const medicalStudent = useQuery(api.medical_student.getCurrentMedicalStudent);
  const currentReviewCase = useQuery(api.review.getReviewsByUserAndStatus, {
    status: ReviewStatus.Created,
  });

  // TODO: Add a loader here
  if (currentReviewCase === undefined || medicalStudent === undefined) {
    return <AppLoader />;
  }

  return (
    // <div className="relative w-full lg:w-3/5 flex flex-col rounded-lg gap-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 sm:items-center">
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 gap-3 sm:gap-6 rounded-lg ${style.glass}`}
      >
        {currentReviewCase.length > 0 ? (
          <>
            <Link
              className="flex items-center justify-center w-full"
              href={`/case/${currentReviewCase[0].case_id}/review`}
            >
              <ClaimCaseCard
                medicalCase={currentReviewCase[0].medicalCase}
                classNames="text-white border-2 border-white/20 hover:bg-transparent hover:border-white/100"
              />
            </Link>
            <p className="text-white text-lg text-center font-medium">
              You are currently reviewing this case
            </p>
          </>
        ) : (
          <>
            <div className="relative flex aspect-square w-3/4 justify-center">
              <Image
                src="/assets/rest.png"
                fill={true}
                className="w-full h-full object-contain"
                alt="No Images Found"
                priority
              />
            </div>
            <p className="text-2xl font-light text-white">No Active Case</p>
          </>
        )}
      </div>
      <div
        className={`w-full h-full p-4 flex items-center flex-col gap-3 sm:gap-6 rounded-lg relative shadow-lg ${style.glass}`}
      >
        <Performance
          correct={medicalStudent.correct_reviews}
          incorrect={medicalStudent.incorrect_reviews}
          total={medicalStudent.total_reviews}
        />
        <div className="w-full self-end justify-self-end flex gap-x-4">
          <Link className="w-full" href={`/dashboard/gallery?tab=completed`}>
            <Button className="w-full" variant="secondary">
              Past Cases
            </Button>
          </Link>
          <Link className="w-full" href={`/dashboard/gallery?tab=open`}>
            <Button className="w-full" variant="action">
              Open Cases
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
