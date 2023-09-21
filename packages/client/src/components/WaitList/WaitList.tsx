"use client";

import React, { useState } from "react";
import { TextInput } from "@mantine/core";
import useNetworkToasts from "@/hooks/useNetworkToasts";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";

export default function WaitList() {
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

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div className="flex flex-col gap-y-4 w-full md:w-3/4 mt-16">
      <p className="text-2xl font-semibold text-center">Join the waitlist</p>
      <div className="flex flex-col md:flex-row gap-y-4 gap-x-8 items-center justify-center">
        <TextInput
          placeholder="hello@homescope.us"
          className="w-full"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <button
          onClick={submit}
          disabled={loading}
          className="flex items-center text-center justify-center border border-black bg-black hover:bg-zinc-700 hover:border-zinc-700 text-white font-medium h-10 w-32 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
