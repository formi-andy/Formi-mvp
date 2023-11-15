"use client";

import React, { ReactNode, useState } from "react";
import { TextInput } from "@mantine/core";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Button } from "../ui/button";
import { validateEmail } from "@/utils/validateEmail";

type Props = {
  text?: ReactNode;
  buttonColor?: string;
  buttonText?: string;
};

export default function WaitList({ text, buttonColor, buttonText }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useNetworkToasts();
  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);

  const submit = async () => {
    if (validateEmail(email)) {
      try {
        setLoading(true);
        toast.loading({
          title: "Joining the waitlist...",
          message: "Thanks for your patience!",
        });
        await joinWaitlist({
          email,
        });
        toast.success({
          title: "Successfully joined the waitlist!",
          message: "We'll be in touch soon.",
        });
      } catch (err) {
        if (err instanceof ConvexError && err.data.code === 409) {
          toast.error({
            title: "You're already on the waitlist!",
            message: "We'll be in touch soon!",
          });
        } else {
          toast.error({
            title: "Something went wrong!",
            message: "Please try again.",
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error({
        title: "Please enter a valid email address.",
        message: "We promise not to spam you!",
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-4 w-full">
      {text}
      <div className="flex flex-col md:flex-row gap-y-4 gap-x-1 items-center justify-center">
        <TextInput
          placeholder="Enter your email"
          className="w-full"
          classNames={{
            input: "lg:rounded-l-2xl h-full",
          }}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <Button
          onClick={submit}
          disabled={loading}
          className={
            "lg:w-72 w-35 text-white lg:rounded-l-none lg:rounded-r-2xl font-medium " +
            buttonColor +
            " " +
            buttonText
          }
        >
          Join the waitlist
        </Button>
      </div>
    </div>
  );
}
