"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import DoctorDashboardView from "./DoctorDashboardView";
import PatientDashboardView from "./PatientDashboardView";
import PlatformTutorial from "@/components/Tutorials/PlatformTutorial";

const DashboardView: React.FC = () => {
  const user = useQuery(api.users.currentUser);
  const { user: clerkUser } = useUser();

  return (
    <>
      {user?.role === "patient" ? (
        <>
          {"tutorial" in (clerkUser?.unsafeMetadata || {}) && (
            <PlatformTutorial />
          )}
          <PatientDashboardView />
        </>
      ) : (
        <DoctorDashboardView />
      )}
    </>
  );
};

export default DashboardView;
