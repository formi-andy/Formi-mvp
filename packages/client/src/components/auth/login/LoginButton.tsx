"use client";

import { signIn } from "next-auth/react";
import { BsGoogle } from "react-icons/bs";

export default function LoginButton() {
  return (
    <button
      className="flex gap-x-2 w-fit items-center bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg transition"
      onClick={() => {
        signIn("google", {
          callbackUrl: "/dashboard",
        });
      }}
    >
      <BsGoogle />
      Continue with Google
    </button>
  );
}
