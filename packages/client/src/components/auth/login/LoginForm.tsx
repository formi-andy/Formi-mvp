"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { TextInput } from "@mantine/core";
import LoginButton from "./LoginButton";
import { FormEvent } from "react";

export default function LoginForm() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const logIn = (e: FormEvent) => {
    e.preventDefault();

    const { values } = form;

    // signInWithEmailAndPassword(auth, values.email, values.password)
    //   .then((userCredential) => {
    //     // The user signed in successfully
    //     const user = userCredential.user;
    //     console.log("User signed in:", user);
    //     navigate("/view");
    //   })
    //   .catch((error) => {
    //     // There was an error signing in the user
    //     console.error("Error signing in user:", error);
    //   });
  };

  return (
    <form className="flex gap-y-4 flex-col w-full" onSubmit={logIn}>
      <TextInput
        label="Email"
        placeholder="Your email"
        value={form.values.email}
        onChange={(event) =>
          form.setFieldValue("email", event.currentTarget.value)
        }
      />
      <TextInput
        type="password"
        label="Password"
        placeholder="Your password"
        value={form.values.password}
        onChange={(event) =>
          form.setFieldValue("password", event.currentTarget.value)
        }
      />
      <button
        className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}
