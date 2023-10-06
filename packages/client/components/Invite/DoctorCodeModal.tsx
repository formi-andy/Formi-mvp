"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useMutation, useQuery } from "convex/react";
import { ActionIcon, Code, CopyButton, Modal, Tooltip } from "@mantine/core";
import { LuCopy, LuCopyCheck } from "react-icons/lu";

import { api } from "@/convex/_generated/api";

export default function DoctorCodeModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const toast = useNetworkToasts();
  const [updating, setUpdating] = useState(false);
  const inviteCode = useQuery(api.invite.getUserInviteCode);
  const generateCode = useMutation(api.invite.generateInviteCode);

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
        <p className="text-xl font-medium text-center">Your invite code</p>
        <p className="text-sm text-center mt-2">
          Give this code to your patient to join their care team
        </p>
        <div className="mt-4 h-[50px] flex items-center justify-center gap-x-2">
          {inviteCode ? (
            <>
              <Code className="h-full flex items-center px-3 text-lg">
                {inviteCode.code}
              </Code>
              <CopyButton value={inviteCode.code} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
                    <ActionIcon
                      className="h-10 w-10 hover:bg-neutral-50 transition rounded-lg"
                      color={copied ? "teal" : "black"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <LuCopyCheck size={20} />
                      ) : (
                        <LuCopy size={20} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </>
          ) : (
            <button
              className="border border-black h-full px-6 font-medium rounded-lg"
              disabled={updating}
              onClick={async () => {
                try {
                  setUpdating(true);
                  toast.loading({
                    title: "Generating code",
                    message: "Please be patient",
                  });
                  await generateCode();
                  toast.success({
                    title: "Code generated",
                    message: "Send this code to your patients",
                  });
                } catch (err) {
                  toast.error({
                    title: "Error generating code",
                    message: "Please try again later",
                  });
                } finally {
                  setUpdating(false);
                }
              }}
            >
              Generate Code
            </button>
          )}
        </div>
      </div>
      {inviteCode && (
        <div className="flex gap-x-4">
          <button
            disabled={updating}
            className="px-6 text-base h-10 border border-black hover:bg-blue-500 hover:border-blue-500 transition hover:text-white rounded-lg"
            onClick={async () => {
              try {
                setUpdating(true);
                toast.loading({
                  title: "Generating a new code",
                  message: "Please be patient",
                });
                await generateCode();
                toast.success({
                  title: "Code generated",
                  message: "Send this code to your patients",
                });
              } catch (err) {
                toast.error({
                  title: "Error generating code",
                  message: "Please try again later",
                });
              } finally {
                setUpdating(false);
              }
            }}
          >
            Generate New Code
          </button>
        </div>
      )}
    </Modal>
  );
}
