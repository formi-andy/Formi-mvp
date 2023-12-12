"use client";

import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { ReviewStatus } from "@/types/review-types";
import { useQuery } from "convex/react";
import AppLoader from "../Loaders/AppLoader";
import ClaimCaseCard from "./Gallery/Case/ClaimCaseCard";
import Link from "next/link";
import { RingProgress } from "@mantine/core";
import { Button } from "../ui/button";
import style from "./doctorgallery.module.css";

export default function DashboardCases() {
  const currentReviewCase = useQuery(api.review.getReviewsByUserAndStatus, {
    status: ReviewStatus.Created,
  });

  // TODO: Add a loader here
  if (currentReviewCase === undefined) {
    return <AppLoader />;
  }

  return (
    <div className="relative w-full lg:w-3/5 flex flex-col rounded-lg gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:items-center">
        <div
          className={`w-full h-full flex flex-col rounded-lg ${style.glass}`}
        >
          {currentReviewCase.length > 0 ? (
            <div className="flex flex-col items-center p-4 h-[40vh] justify-center">
              <Link
                className="flex flex-col gap-y-8"
                href={`/case/${currentReviewCase[0].case_id}/review`}
              >
                <ClaimCaseCard
                  medicalCase={currentReviewCase[0].medicalCase}
                  setOpened={() => {}}
                  setCaseData={() => {}}
                />
                <p className="text-3xl font-light">
                  You are currently reviewing this case
                </p>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4 h-full rounded-lg justify-center">
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
            </div>
          )}
        </div>
        <div
          className={`w-full h-full p-4 flex items-center justify-center flex-col gap-4 rounded-lg relative shadow-lg ${style.glass}`}
        >
          <RingProgress
            size={200}
            thickness={6}
            roundCaps
            label={
              <p className="text-center text-white text-2xl font-light">
                88.8%
              </p>
            }
            sections={[
              { value: 40, color: "green" },
              { value: 15, color: "red" },
            ]}
          />
          <div className="flex flex-col text-white items-center">
            <p className="text-2xl font-light mb-2">Performance</p>
            <p>40/45 cases reviewed correctly</p>
          </div>
          <div className="w-full flex gap-x-4">
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
    </div>
  );
}
