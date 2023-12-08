"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { PasswordInput } from "@mantine/core";
import { Button } from "../ui/button";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

export default function LockedAuth({
  setVerified,
}: {
  setVerified: Dispatch<SetStateAction<boolean>>;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();

  return (
    <div className="flex flex-1 h-[calc(100vh_-_152px)] justify-center items-center flex-col w-full">
      <div className="w-[25rem] max-w-[calc(100vw-5rem)] py-12 px-8 shadow-accent-2 rounded-2xl flex flex-col gap-y-4">
        <div className="flex flex-col self-start">
          <p className="text-xl font-semibold">Enter the Password</p>
          <p className="opacity-60">to continue to Formi</p>
        </div>
        <PasswordInput
          placeholder="The Formi team gave this to you"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
          label="Password"
        />
        <Button
          variant="outline-action"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            toast.loading({
              title: "Verifying Password",
            });
            const { data } = await axios.post("/api/check-password", {
              password,
            });
            if (data.verified) {
              toast.success({
                title: "Password Verified",
              });
              setVerified(true);
            } else {
              toast.error({
                title: "Incorrect Password",
                message: "Please try again.",
              });
            }
            setLoading(false);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
