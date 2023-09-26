"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import AppLoader from "@/components/Loaders/AppLoader";
import PatientInvites from "@/components/Invite/PatientInvites";
import DoctorInvites from "@/components/Invite/DoctorInvites";
import NotFoundPage from "../not-found";
import InviteTop from "@/components/Invite/InviteTop";

export default function Invite() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return <AppLoader />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <InviteTop role={user.role} />
      {user.role === "doctor" ? <DoctorInvites /> : <PatientInvites />}
    </div>
  );
}
