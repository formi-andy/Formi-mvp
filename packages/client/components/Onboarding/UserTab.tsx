"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";

export default function UserTab() {
  const router = useRouter();
  const toast = useNetworkToasts();
  const [loading, setLoading] = useState(false);
  const updateRole = useAction(api.users.setPatientAction);

  return (
    <div className="flex items-center justify-center p-4 rounded-lg border w-full">
      <Button
        disabled={loading}
        variant="outline-action"
        onClick={async () => {
          try {
            setLoading(true);
            toast.loading({
              title: "Setting up your account",
              message: "Please wait",
            });
            await updateRole();
            toast.success({
              title: "Account set up",
              message: "Let's set up your patient profile",
            });
            router.push("/dashboard");
          } catch {
            toast.error({
              title: "Error setting up your account",
              message: "Please try again",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        Continue to Dashboard
      </Button>
    </div>
  );
}
