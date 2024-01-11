"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { LuPenSquare } from "react-icons/lu";
import { PinInput } from "@mantine/core";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useClerk } from "@clerk/nextjs";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useRouter } from "next/navigation";

export default function VerifyEmail({
  studentEmail,
  email,
  emailSent,
  setEmailSent,
  setChangeEmail,
}: {
  studentEmail?: string;
  email: string;
  emailSent: boolean;
  setEmailSent: Dispatch<SetStateAction<boolean>>;
  setChangeEmail: Dispatch<SetStateAction<boolean>>;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();
  const clerk = useClerk();
  const router = useRouter();

  const verifyEmail = useAction(api.medical_student.verifyEmail);

  return (
    <>
      <p className="text-xl lg:text-2xl font-medium text-center">
        Verify your email
      </p>
      <div className="my-2 flex gap-x-2 items-center">
        <div className="border rounded-full py-2 px-6 border-black">
          <p className="text-sm">{studentEmail || email}</p>
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setEmailSent(false);
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
        disabled={code.length !== 6 || loading}
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
            setLoading(true);
            toast.loading({
              title: "Verifying email...",
              message: "Please wait",
            });
            await emailAddress.attemptVerification({
              code,
            });
            await verifyEmail({ email: studentEmail || email });
            toast.success({
              title: "Email verified",
              message: "Navigating to dashboard",
            });
            router.push("/dashboard");
          } catch (error: any) {
            setCode("");
            toast.error({
              title: "Error verifying email",
              message:
                error?.errors?.[0]?.longMessage || "Please try again later",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        Verify
      </Button>
      <Button
        disabled={loading}
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
            setLoading(true);
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
          } finally {
            setLoading(false);
          }
        }}
      >
        Didn&apos;t receive a code? Resend
      </Button>
    </>
  );
}
