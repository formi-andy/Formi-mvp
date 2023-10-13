"use client";

import { useState } from "react";
import { Textarea } from "@mantine/core";
import Link from "next/link";

const FinishedCall = () => {
  const [notes, setNotes] = useState("");

  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center min-h-[calc(100vh_-_152px)]">
      <p className="text-2xl text-center">Thanks for using Homescope!</p>
      <div className="w-fit flex flex-col sm:flex-row gap-4">
        <Link
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition h-12 w-52"
          href="/case/create"
        >
          Create a Case
        </Link>
        <Link
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition w-52 h-12"
          href="/record"
        >
          Join Another Meeting
        </Link>
      </div>
      {/* <div className="flex flex-col gap-y-2 w-full items-center">
        <p className="text-lg font-light text-center">
          Please leave any feedback you have for us below!
        </p>
        <Textarea
          minRows={3}
          maxRows={6}
          className="w-3/4 sm:w-2/3 md:w-1/2 max-w-2xl"
          placeholder="Leave feedback for us here!"
          value={notes}
          onChange={(event) => {
            setNotes(event.currentTarget.value);
          }}
        />
        <button
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white rounded-lg transition w-52 h-12"
          onClick={() => {
            fetch("/api/feedback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                notes,
                user: data?.user,
              }),
            });
          }}
        >
          Submit Feedback
        </button>
      </div> */}
    </div>
  );
};

export default FinishedCall;
