"use client";

import React, { useState } from "react";
import { TextInput } from "@mantine/core";
import { message } from "antd";
import axios from "axios";

export default function WaitList() {
  const [email, setEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Successfully joined the waitlist!",
    });
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Please enter a valid email address.",
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong. Please try again.",
    });
  };

  const submit = async () => {
    if (validateEmail(email)) {
      try {
        let result = await axios.post("/api/waitlist", {
          email,
        });
        success();
      } catch (err) {
        error();
      }
    } else {
      warning();
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
      {contextHolder}
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
          className="flex items-center text-center justify-center border border-black bg-black hover:bg-zinc-700 hover:border-zinc-700 text-white font-medium h-10 w-32 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
