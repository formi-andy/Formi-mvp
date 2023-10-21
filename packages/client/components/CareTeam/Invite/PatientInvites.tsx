"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LuSend } from "react-icons/lu";
import PatientInvite from "./PatientInvite";
import PatientInviteLoader from "./PatientInviteLoader";
import { INVITES_LOADERS } from "@/commons/constants/loaders";

type Invites = (typeof api.invite.getPendingInvites)["_returnType"];

function renderInvites(invites: Invites | undefined) {
  if (invites === undefined) {
    return [...Array(INVITES_LOADERS)].map((_, index) => {
      return <PatientInviteLoader key={index} />;
    });
  }

  if (invites.length === 0) {
    return (
      <div className="flex flex-col p-4 lg:p-8">
        <div className="flex flex-col items-center p-8 lg:p-4">
          <div className="p-4 border rounded-lg">
            <LuSend size={32} />
          </div>
          <p className="text-base font-medium mt-6 text-center">
            No invites found
          </p>
          <p className="text-sm mt-3 text-center w-80">
            Pending invitations that you sent to join your care team will show
            up here.
          </p>
        </div>
        <p className="text-base font-medium text-center mb-4">
          How to invite your doctor
        </p>
        <div className="flex flex-col border divide-y rounded-lg">
          <div className="p-4">
            <p className="text-sm">Get your doctor&apos;s invite code</p>
          </div>
          <div className="p-4">
            <p className="text-sm">Enter the code on this page</p>
          </div>
          <div className="p-4">
            <p className="text-sm">
              Once your doctor accepts they will be added to your care team
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {invites.map((invite) => {
        return <PatientInvite key={invite._id} invite={invite} />;
      })}
    </div>
  );
}

export default function PatientInvites() {
  const pendingInvites = useQuery(api.invite.getPendingInvites);

  return (
    <div className="border rounded-lg flex flex-col gap-4 lg:gap-8">
      <p className="text-lg font-medium p-4 lg:p-8">Pending Invites</p>
      <div className="flex flex-col items-center gap-4">
        {renderInvites(pendingInvites)}
      </div>
    </div>
  );
}
