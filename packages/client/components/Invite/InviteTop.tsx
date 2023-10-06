"use client";

import { useState } from "react";
import InviteDoctorModal from "./InviteDoctorModal";
import DoctorCodeModal from "./DoctorCodeModal";
import { Button } from "../ui/button";

export default function InviteTop({ role }: { role: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-10">
      <div className="flex flex-col flex-1 gap-y-2">
        <p className="text-4xl font-medium">Invites</p>
        {role === "doctor" ? (
          <p className="text-sm">
            Your invites to join your patients' care team will show up here.
          </p>
        ) : (
          <p className="text-sm">
            Your invites to your doctors to join your care team will show up
            here.
          </p>
        )}
      </div>
      <div>
        <Button
          variant="outline-action"
          onClick={() => {
            setOpened(true);
          }}
        >
          {role === "doctor" ? "View your code" : "Invite a doctor"}
        </Button>
      </div>
      {role === "doctor" ? (
        <DoctorCodeModal opened={opened} setOpened={setOpened} />
      ) : (
        <InviteDoctorModal opened={opened} setOpened={setOpened} />
      )}
    </div>
  );
}
