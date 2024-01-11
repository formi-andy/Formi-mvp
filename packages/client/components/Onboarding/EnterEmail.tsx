import { TextInput } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { validateEmail } from "@/utils/validateEmail";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useClerk } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function EnterEmail({
  email,
  setEmail,
  setEmailSent,
  setChangeEmail,
  setEnterPassword,
}: {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setEmailSent: Dispatch<SetStateAction<boolean>>;
  setChangeEmail: Dispatch<SetStateAction<boolean>>;
  setEnterPassword: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();
  const clerk = useClerk();
  const router = useRouter();

  const setEmailMetadata = useAction(api.medical_student.setEmailMetadata);
  const verifyEmail = useAction(api.medical_student.verifyEmail);
  const studentEmail = clerk.user?.publicMetadata.student_email as
    | string
    | undefined;

  return (
    <>
      <div className="w-full">
        <TextInput
          type="email"
          classNames={{ root: "w-full" }}
          label="School Email"
          placeholder="student@school.edu"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <Button
          variant="link"
          className="p-0"
          onClick={() => {
            setEnterPassword(true);
          }}
        >
          Use Password Instead
        </Button>
      </div>
      <Button
        disabled={loading}
        variant="outline-action"
        onClick={async () => {
          if (!validateEmail(email)) {
            toast.error({
              title: "Invalid email",
              message: "Please enter a valid email",
            });
            return;
          }

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
            setLoading(true);
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
              const existingEmail = clerk.user?.emailAddresses.find(
                (emailAddress) => emailAddress.emailAddress === email
              );
              if (existingEmail) {
                toast.loading({
                  title: "Verifying email...",
                  message: "Please wait",
                });
                await verifyEmail({ email });
                toast.success({
                  title: "Email verified",
                  message: "Navigating to dashboard",
                });
                router.push("/dashboard");
              } else {
                toast.loading({
                  title: "Adding email...",
                  message: "Please wait",
                });
                const emailAddress = await clerk.user?.createEmailAddress({
                  email,
                });
                await Promise.all([
                  emailAddress?.prepareVerification({
                    strategy: "email_code",
                  }),
                  setEmailMetadata({ email }),
                ]);
                setEmailSent(true);
                toast.success({
                  title: "Email set",
                  message: "Verification email sent",
                });
                setChangeEmail(false);
              }
            }
          } catch (error) {
            toast.error({
              title: "Error setting email",
              message: "Please try again later",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        Send Verification Email
      </Button>
    </>
  );
}
