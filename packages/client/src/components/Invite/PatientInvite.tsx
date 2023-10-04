"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { Code } from "@mantine/core";
import { api } from "../../../convex/_generated/api";

type Invite = (typeof api.invite.getPendingInvites)["_returnType"][number];

export default function PatientInvite({ invite }: { invite: Invite }) {
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="p-4 flex justify-between w-full items-center border-t">
      <div className="flex flex-col">
        <p className="font-medium">
          Sent on {dayjs(invite._creationTime).format("M/DD/YYYY")}
        </p>
        <div className="flex gap-x-2 items-center mt-1 h-6">
          <button
            className="p-1 hover:bg-neutral-50 transition"
            onClick={() => {
              setShowCode(!showCode);
            }}
          >
            {showCode ? (
              <p className="text-sm">
                <LuEyeOff />
              </p>
            ) : (
              <p className="text-sm">
                <LuEye />
              </p>
            )}
          </button>
          {showCode ? (
            <Code className="text-sm">{invite.code}</Code>
          ) : (
            <p className="text-sm">•••••••••••••••</p>
          )}
        </div>
      </div>
      <button className="border h-10 px-3 rounded-lg flex items-center justify-center border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
        Cancel
      </button>
    </div>
  );
}
