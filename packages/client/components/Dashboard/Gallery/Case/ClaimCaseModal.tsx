"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useMutation } from "convex/react";
import { Modal } from "@mantine/core";
import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";

export default function ClaimCaseModal({
  opened,
  setOpened,
  caseData,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  caseData: Record<string, string | number>;
}) {
  const toast = useNetworkToasts();
  const [updating, setUpdating] = useState(false);

  const addReviewerToCase = useMutation(
    api.medical_case.addReviewerToMedicalCase
  );

  const router = useRouter();

  const startReview = async () => {
    setUpdating(true);

    toast.loading({
      title: "Adding you as a reviewer...",
      message: "Please wait",
    });

    try {
      await addReviewerToCase({
        id: caseData.id as Id<"medical_case">,
      });

      toast.success({
        title: "Successfully added as a reviewer",
        message: "Opening case...",
      });
      router.push(`/case/${caseData.id}/review`);
      setOpened(false);
    } catch (error) {
      toast.error({
        title: "Error accepting case",
        message:
          error instanceof ConvexError
            ? (error.data as { message: string }).message
            : undefined,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      classNames={{
        body: "flex flex-col gap-y-4 items-center",
      }}
    >
      <p className="text-xl font-medium text-center">
        Review Case #{caseData.id}
      </p>
      <p>Pressing confirm will start the review process</p>
      <div>
        <p className="text-center">Case Details</p>
        <div className="bg-slate-100 rounded p-4 my-2 font-mono">
          <p>Title: {caseData.title}</p>
          <p className="capitalize">
            Chief Complaint:{" "}
            {(caseData.chiefComplaint as string).replace(/_/g, " ")}
          </p>
          <p>Duration: {caseData.duration} minutes</p>
          <p>Pay Out: ${caseData.pay}</p>
        </div>
      </div>
      <div className="flex gap-x-4 w-full justify-center">
        <Button
          className="bg-green-500 text-lg"
          onClick={startReview}
          disabled={updating}
        >
          Confirm
        </Button>
        <Button className="bg-red-500 text-lg" onClick={() => setOpened(false)}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
