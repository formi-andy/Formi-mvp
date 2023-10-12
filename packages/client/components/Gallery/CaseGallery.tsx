"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

import { LuCheck } from "react-icons/lu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GALLERY_LOADERS } from "@/commons/constants/loaders";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Button } from "../ui/button";
import NoCases from "./NoCases";
import CaseCard from "./CaseCard";

const CaseGallery: React.FC = () => {
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
      return (
        <div key={date} className="flex flex-col gap-y-2">
          <p className="text-lg lg:text-xl font-medium">
            {dayjs(date).format("M/DD/YYYY")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
            {medicalCases.map((medicalCase) => {
              return (
                <div
                  className="flex flex-col relative cursor-pointer"
                  key={medicalCase._id}
                >
                  <Link href={`/case/${medicalCase._id}`}>
                    <CaseCard medicalCase={medicalCase} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      );
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

export default CaseGallery;
