"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import AppLoader from "@/components/Loaders/AppLoader";
import PatientView from "@/components/Invite/PatientView";
import DoctorView from "@/components/Invite/DoctorView";
import NotFoundPage from "../not-found";

export default function Invite() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return <AppLoader />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  if (user.role === "doctor") {
    return <DoctorView />;
  }

  return <PatientView />;
}
