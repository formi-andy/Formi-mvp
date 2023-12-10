import React from "react";
import DashboardCases from "./DashboardCases";

// 408df5

export default function DoctorDashboard() {
  return (
    <>
      <DashboardCases />
      <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="flex flex-col border rounded-lg min-h-[200px] p-4 lg:p-8 gap-4">
          <p className="text-2xl font-medium">Practice</p>
          <div className="flex flex-wrap gap-4"></div>
        </div>
        <div className="flex flex-col border rounded-lg min-h-[200px] p-4 lg:p-8 gap-4">
          <p className="text-2xl font-medium">Feedback</p>
        </div>
      </div>
    </>
  );
}
