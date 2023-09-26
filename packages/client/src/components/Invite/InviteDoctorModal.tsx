"use client";

import { Modal } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export default function InviteDoctorModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
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
      </div>
      <div className="flex gap-x-4">
        <button
          className="w-40 text-xl h-12 border rounded-lg hover:border-black transition"
          onClick={() => setOpened(false)}
        >
          Cancel
        </button>
        <button
          className="w-40 text-xl bg-red-500 hover:bg-red-600 transition text-white rounded-lg"
          // onClick={async () => {
          //   try {
          //     setUpdating(true);
          //     toast.loading({
          //       title: "Deleting image",
          //       message: "Please be patient",
          //     });
          //     await deleteImage({
          //       ids: [image._id],
          //     });
          //     toast.success({
          //       title: "Successfully deleted image",
          //       message: "Redirecting to dashboard",
          //     });
          //     router.push("/dashboard");
          //   } catch (err) {
          //     toast.error({
          //       title: "Error deleting image",
          //       message: "Please try again later",
          //     });
          //     setUpdating(false);
          //   }
          // }}
        >
          Invite
        </button>
      </div>
    </Modal>
  );
}
