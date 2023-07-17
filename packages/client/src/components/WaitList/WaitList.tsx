"use client";

import React, { useState } from "react";
import { TextInput, Transition } from "@mantine/core";
import { validateEmail } from "@/utils/validateEmail";

type Props = {};

const WaitList = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const joinWaitList = () => {
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
    // TODO: check if email is already in wait list
    setErrorMessage("");
    setJoined(true);

    setTimeout(() => {
      setJoined(false);
    }, 3000);
  };

  return (
    <div className="w-3/4 flex items-center flex-col gap-y-4 justify-center">
      <p className="text-2xl">Join the wait list.</p>
      <p className="text-lg">
        Be the first to know when we launch in your area.
      </p>
      <TextInput
        className="w-full"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        error={errorMessage}
        classNames={{
          error: "text-center",
        }}
      />
      <button
        type="submit"
        className="flex items-center text-center justify-center border border-black bg-black hover:bg-neutral-700 hover:border-neutral-700 text-white font-medium py-2 w-40 rounded transition"
        onClick={joinWaitList}
      >
        Join
      </button>
      <p
        className={
          "text-lg transition-all duration-300 " +
          (joined ? "opacity-100" : "opacity-0")
        }
      >
        Thanks for joining the wait list! We&apos;ll let you know when we launch
        in your area.
      </p>
    </div>
  );
};

export default WaitList;
