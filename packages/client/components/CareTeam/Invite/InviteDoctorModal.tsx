"use client";

import useNetworkToasts from "@/hooks/useNetworkToasts";
import { Modal, TextInput } from "@mantine/core";
import { useMutation } from "convex/react";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "@/convex/_generated/api";

export default function InviteDoctorModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const toast = useNetworkToasts();
  const [updating, setUpdating] = useState(false);
  const [code, setCode] = useState("");
  const createInvite = useMutation(api.invite.createInvite);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      classNames={{
        body: "flex flex-col gap-y-4 items-center",
      }}
    >
      <div>
        <p className="text-xl font-medium text-center">
          Invite a doctor to your care team
        </p>
        <p className="text-sm text-center mt-2">
          Enter the invite code given to you by your doctor below.
        </p>
        <TextInput
          className="mt-4"
          placeholder="Invite code"
          variant="filled"
          size="lg"
          value={code}
          onChange={(event) => setCode(event.currentTarget.value)}
        />
      </div>
      <div className="flex gap-x-4">
        <button
          disabled={updating}
          className="w-28 h-10 border rounded-lg hover:border-black transition"
          onClick={() => setOpened(false)}
        >
          Cancel
        </button>
        <button
          disabled={updating}
          className="w-28 text-base h-10 bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg"
          onClick={async () => {
            try {
              setUpdating(true);
              toast.loading({
                title: "Creating invite",
                message: "Please be patient",
              });
              await createInvite({
                code,
              });
              toast.success({
                title: "Invite created",
                message: "Your doctor has been notified",
              });
            } catch (err) {
              toast.error({
                title: "Error creating invite",
                message: "Check your code and please try again later",
              });
            } finally {
              setUpdating(false);
            }
          }}
        >
          Invite
        </button>
      </div>
    </Modal>
  );
}
