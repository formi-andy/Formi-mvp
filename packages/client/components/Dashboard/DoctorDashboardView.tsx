"use client";

import { useState } from "react";
import { Tabs } from "@mantine/core";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import NoReviewedCases from "./Gallery/NoReviewedCases";
import ClaimCaseGallery from "./Gallery/ClaimCaseGallery";
import { renderCases } from "./Gallery/RenderCases";

const DoctorDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>("review");

  const medicalCasesByDate = useQuery(
    api.medical_case.listMedicalCasesByReviewer,
    {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  );

  return (
    <Tabs color="rgba(0, 0, 0, 1)" value={activeTab} onChange={setActiveTab}>
      <Tabs.List grow>
        <Tabs.Tab value="review">Open Cases</Tabs.Tab>
        <Tabs.Tab value="completed">Completed Cases</Tabs.Tab>
      </Tabs.List>

      <div className="my-8">
        <Tabs.Panel value="review">
          <ClaimCaseGallery />
        </Tabs.Panel>
        <Tabs.Panel value="completed">
          {renderCases({
            cases: medicalCasesByDate,
            emptyComponent: <NoReviewedCases />,
          })}
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};

export default DoctorDashboardView;
