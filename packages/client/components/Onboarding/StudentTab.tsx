"use client";

import { PinInput, TextInput } from "@mantine/core";
import { Button } from "../ui/button";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { LuPenSquare } from "react-icons/lu";

export default function StudentTab() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [changeEmail, setChangeEmail] = useState(false);
  const toast = useNetworkToasts();
  const setEmailMetadata = useAction(api.medical_student.setEmailMetadata);
  const verifyEmail = useAction(api.medical_student.verifyEmail);
  const clerk = useClerk();
  const studentEmail = clerk.user?.publicMetadata.student_email as
    | string
    | undefined;

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center p-4 rounded-lg border w-full">
      {studentEmail && !changeEmail ? (
        <>
          <p className="text-xl lg:text-2xl font-medium text-center">
            Verify your email
          </p>
          <div className="my-2 flex gap-x-2 items-center">
            <div className="border rounded-full py-2 px-6 border-black">
              <p className="text-sm">{studentEmail}</p>
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setChangeEmail(true);
              }}
            >
              <LuPenSquare />
            </Button>
          </div>
          <PinInput
            length={6}
            type="number"
            placeholder=""
            classNames={{
              root: "w-fit",
            }}
            onChange={(event) => {
              setCode(event);
            }}
          />
          <Button
            variant="outline-action"
            disabled={code.length !== 6}
            onClick={async () => {
              const emailAddress = clerk.user?.emailAddresses.find(
                (emailAddress) => emailAddress.emailAddress === studentEmail
              );
              if (!emailAddress) {
                toast.error({
                  title: "Error with this email",
                  message: "Please re-enter your email",
                });
                return;
              }
              try {
                toast.loading({
                  title: "Verifying email...",
                  message: "Please wait",
                });
                await emailAddress.attemptVerification({
                  code,
                });
                await verifyEmail({ email: studentEmail });
                toast.success({
                  title: "Email verified",
                  message: "Navigating to dashboard",
                });
              } catch (error: any) {
                setCode("");
                toast.error({
                  title: "Error verifying email",
                  message:
                    error?.errors?.[0]?.longMessage || "Please try again later",
                });
              }
            }}
          >
            Verify
          </Button>
          <Button
            variant="link"
            onClick={async () => {
              const emailAddress = clerk.user?.emailAddresses.find(
                (emailAddress) => emailAddress.emailAddress === studentEmail
              );
              if (!emailAddress) {
                toast.error({
                  title: "Error with this email",
                  message: "Please re-enter your email",
                });
                return;
              }
              try {
                toast.loading({
                  title: "Sending code...",
                  message: "Please wait",
                });
                await emailAddress.prepareVerification({
                  strategy: "email_code",
                });
                toast.success({
                  title: "Code sent",
                  message: "Please check your email",
                });
              } catch (error) {
                toast.error({
                  title: "Error sending code",
                  message: "Please try again later",
                });
              }
            }}
          >
            Didn&apos;t receive a code? Resend
          </Button>
        </>
      ) : (
        <>
          <TextInput
            type="email"
            classNames={{ root: "w-full" }}
            label="School Email"
            placeholder="student@school.edu"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <Button
            variant="outline-action"
            onClick={async () => {
              const domain = email.split("@")[1];
              const [school, extension] = domain.split(".");
              if (extension !== "edu") {
                toast.error({
                  title: "Email must be .edu",
                  message: "Please enter a valid .edu email",
                });
                return;
              }

              try {
                if (studentEmail) {
                  toast.loading({
                    title: "Updating email...",
                    message: "Please wait",
                  });
                  const emailAddress = clerk.user?.emailAddresses.find(
                    (emailAddress) => emailAddress.emailAddress === studentEmail
                  );
                  if (emailAddress) {
                    await emailAddress.destroy();
                  }
                } else {
                  toast.loading({
                    title: "Adding email...",
                    message: "Please wait",
                  });
                }
                const emailAddress = await clerk.user?.createEmailAddress({
                  email,
                });
                await Promise.all([
                  emailAddress?.prepareVerification({
                    strategy: "email_code",
                  }),
                  setEmailMetadata({ email }),
                ]);
                toast.success({
                  title: "Email set",
                  message: "Verification email sent",
                });
                setChangeEmail(false);
              } catch (error) {
                toast.error({
                  title: "Error setting email",
                  message: "Please try again later",
                });
              }
            }}
          >
            Send Verification Email
          </Button>
        </>
      )}
    </div>
  );
}
