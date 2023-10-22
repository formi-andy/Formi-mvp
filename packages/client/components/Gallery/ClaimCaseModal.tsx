"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useMutation, useQuery } from "convex/react";
import { ActionIcon, Code, CopyButton, Modal, Tooltip } from "@mantine/core";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";

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
    api.medical_case.addReviewersToMedicalCase
  );
  const user = useQuery(api.users.currentUser);

  const addReviewer = async () => {
    if (!user) {
      toast.error({
        message: "Error retrieving user id",
      });
      return;
    }

    try {
      await addReviewerToCase({
        id: caseData.id as Id<"medical_case">,
        reviewers: [user._id],
      });

      toast.success({
        message: "Successfully added as a reviewer",
      });
      setOpened(false);
    } catch (error) {
      toast.error({
        message: "Error accepting case",
      });
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
      <p className="text-xl font-medium text-center">Claim case for review?</p>
      <div>
        <p className="text-center">Case Details</p>
        <div className="bg-slate-100 rounded p-4 my-2 font-mono">
          <p>Title: {caseData.title}</p>
          <p>Chief Complaint: {caseData.chiefComplaint}</p>
          <p>Duration: {caseData.duration} minutes</p>
          <p>Pay Out: ${caseData.pay}</p>
        </div>
      </div>
      <div className="flex gap-x-4 w-full justify-center">
        <Button className="bg-green-500 text-lg" onClick={addReviewer}>
          Confirm
        </Button>
        <Button className="bg-red-500 text-lg" onClick={() => setOpened(false)}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
