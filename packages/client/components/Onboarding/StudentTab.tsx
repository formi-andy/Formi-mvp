"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import VerifyEmail from "./VerifyEmail";
import EnterEmail from "./EnterEmail";
import EnterPassword from "./EnterPassword";

export default function StudentTab() {
  const clerk = useClerk();

  const [email, setEmail] = useState("");
  const [enterPassword, setEnterPassword] = useState(false); // TODO: Remove this
  const [emailSent, setEmailSent] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const studentEmail = clerk.user?.publicMetadata.student_email as
    | string
    | undefined;

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center p-4 rounded-lg border w-full">
      {(studentEmail || emailSent) && !changeEmail ? (
        <VerifyEmail
          studentEmail={studentEmail}
          email={email}
          emailSent={emailSent}
          setEmailSent={setEmailSent}
          setChangeEmail={setChangeEmail}
        />
      ) : enterPassword ? (
        <EnterPassword setEnterPassword={setEnterPassword} />
      ) : (
        <EnterEmail
          email={email}
          setEmail={setEmail}
          setEmailSent={setEmailSent}
          setEnterPassword={setEnterPassword}
          setChangeEmail={setChangeEmail}
        />
      )}
    </div>
  );
}
