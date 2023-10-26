"use client";

import { useQuery } from "convex/react";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

import { api } from "@/convex/_generated/api";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "../ui/button";
import NoCases from "./NoCases";
import CaseRow from "./Case/CaseRow";

const DoctorCaseGallery: React.FC = () => {
  let medicalCasesByDate = useQuery(
    api.medical_case.listMedicalCasesByReviewer,
    {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  );

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

    // split into pending and completed
    let pendingCasesByDate: any = [];
    let completedCasesByDate: any = [];

    medicalCasesByDate.forEach(({ date, medicalCases }) => {
      const pendingCases = medicalCases.filter(
        (medicalCase) => medicalCase.status === "PENDING"
      );
      const completedCases = medicalCases.filter(
        (medicalCase) => medicalCase.status === "COMPLETED"
      );

      if (pendingCases.length > 0) {
        pendingCasesByDate.push({
          date,
          medicalCases: pendingCases,
        });
      }

      if (completedCases.length > 0) {
        completedCasesByDate.push({
          date,
          medicalCases: completedCases,
        });
      }
    });

    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xl lg:text-2xl font-medium">Pending Cases</p>
          <Link href="/case/claim">
            <Button>Claim More Cases</Button>
          </Link>
        </div>
        {pendingCasesByDate.length === 0 ? (
          <p className="font-medium">No pending cases</p>
        ) : (
          pendingCasesByDate.map(({ date, medicalCases }) => {
            return <CaseRow date={date} medicalCases={medicalCases} />;
          })
        )}
        <div className="flex justify-between items-center mt-8">
          <p className="text-xl lg:text-2xl font-medium">Completed Cases</p>
        </div>{" "}
        {completedCasesByDate.length === 0 ? (
          <p className="font-medium">No completed cases</p>
        ) : (
          completedCasesByDate.map(({ date, medicalCases }) => {
            return <CaseRow date={date} medicalCases={medicalCases} />;
          })
        )}
      </div>
    );
  };

  return <>{renderCases()}</>;
};

export default DoctorCaseGallery;
