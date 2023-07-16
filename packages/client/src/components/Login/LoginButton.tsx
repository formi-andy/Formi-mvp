"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg transition"
      onClick={() => {
        signIn("google", {
          callbackUrl: "/dashboard",
        });
      }}
    >
      Continue with Google
    </button>
  );
}
