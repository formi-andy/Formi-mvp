"use client";

import Image from "next/image";
import dayjs from "dayjs";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";

type Invite = (typeof api.invite.getPendingInvites)["_returnType"][number];

export default function DoctorInvite({ invite }: { invite: Invite }) {
  const inviteAction = useMutation(api.invite.updateInvite);
  const toast = useNetworkToasts();
  const [updating, setUpdating] = useState(false);

  return (
    <div className="p-4 flex justify-between w-full items-center border-t">
      <div className="flex items-center gap-x-2 relative">
        <Image
          src={invite.sent_by.imageUrl}
          alt="Profile picture"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col">
          <p className="font-medium">
            Sent by {invite.sent_by.firstName} {invite.sent_by.lastName}
          </p>
          <p className="text-sm">
            {dayjs(invite._creationTime).format("M/DD/YYYY")}
          </p>
        </div>
      </div>
      <div className="flex gap-x-4 items-center">
        <button
          className="font-medium border h-10 px-3 rounded-lg flex items-center justify-center border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          disabled={updating}
          onClick={async () => {
            try {
              setUpdating(true);
              toast.loading({
                title: "Declining invite...",
                message: "Please wait while we decline the invite",
              });
              await inviteAction({
                action: false,
                invite_id: invite._id,
              });
              toast.success({
                title: "Invite declined",
                message: "You have declined the invite",
              });
            } catch {
              toast.error({
                title: "Failed to decline invite",
                message: "Please try again later",
              });
            } finally {
              setUpdating(false);
            }
          }}
        >
          Decline
        </button>
        <button
          className="font-medium border h-10 px-3 rounded-lg flex items-center justify-center border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition"
          disabled={updating}
          onClick={async () => {
            try {
              setUpdating(true);
              toast.loading({
                title: "Accepting invite...",
                message: "Please wait while we accept the invite",
              });
              await inviteAction({
                action: true,
                invite_id: invite._id,
              });
              toast.success({
                title: "Invite accepted",
                message: "You are now part of the patient's care team",
              });
            } catch {
              toast.error({
                title: "Failed to accept invite",
                message: "Please try again later",
              });
            } finally {
              setUpdating(false);
            }
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
