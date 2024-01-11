import { TextInput } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";

export default function EnterPassword({
  setEnterPassword,
}: {
  setEnterPassword: Dispatch<SetStateAction<boolean>>;
}) {
  const [formPassword, setFormPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();
  const verifyPassword = useAction(api.medical_student.verifyFormPassword);

  return (
    <>
      <div className="w-full">
        <TextInput
          type="text"
          classNames={{ root: "w-full" }}
          label="Password"
          placeholder="From the Formi team"
          value={formPassword}
          onChange={(event) => setFormPassword(event.currentTarget.value)}
        />
        <Button
          variant="link"
          className="p-0"
          onClick={() => {
            setEnterPassword(false);
          }}
        >
          Use Email Instead
        </Button>
      </div>
      <Button
        disabled={loading}
        variant="outline-action"
        onClick={async () => {
          try {
            setLoading(true);
            toast.loading({
              title: "Verifying password",
              message: "Please wait",
            });
            await verifyPassword({
              password: formPassword,
            });
            toast.success({
              title: "Password verified",
              message: "Redirecting you to the dashboard",
            });
          } catch (error) {
            toast.error({
              title: "Error verifying password",
              message:
                error instanceof ConvexError
                  ? (error.data as { message: string }).message
                  : "Please try again later",
            });
          } finally {
            setLoading(false);
          }
        }}
      >
        Submit
      </Button>
    </>
  );
}
