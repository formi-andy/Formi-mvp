"use client";

import { useForm } from "@mantine/form";
import { TextInput, Checkbox } from "@mantine/core";
import { FormEvent } from "react";

export default function SignupForm() {
  const register = (e: FormEvent) => {
    e.preventDefault();
    // const auth = getAuth();

    const { values } = form;

    console.log("VALUES", values);

    // createUserWithEmailAndPassword(auth, values.email, values.password)
    //   .then((userCredential) => {
    //     // The user account was created successfully
    //     const user = userCredential.user;
    //     console.log("User account created:", user);
    //     // navigate("/view");
    //   })
    //   .catch((error) => {
    //     // There was an error creating the user account
    //     console.error("Error creating user account:", error);
    //   });
  };

  const form = useForm({
    initialValues: {
      email: "",
      fname: "",
      lname: "",
      password: "",
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => {
        const res =
          val.length < 6
            ? "Password should include at least 6 characters"
            : null;
        console.log("VAL", val, res);
        return res;
      },
    },
  });

  return (
    <form className="flex flex-col gap-y-4" onSubmit={(e) => register(e)}>
      <div className="flex gap-x-4">
        <TextInput
          classNames={{
            root: "w-full",
          }}
          required
          label="First Name"
          placeholder="Your first name"
          value={form.values.fname}
          onChange={(event) =>
            form.setFieldValue("fname", event.currentTarget.value)
          }
        />
        <TextInput
          classNames={{
            root: "w-full",
          }}
          required
          label="Last Name"
          placeholder="Your last name"
          value={form.values.lname}
          onChange={(event) =>
            form.setFieldValue("lname", event.currentTarget.value)
          }
        />
      </div>
      <TextInput
        required
        label="Email"
        placeholder="hello@homescape.com"
        value={form.values.email}
        onChange={(event) =>
          form.setFieldValue("email", event.currentTarget.value)
        }
        error={form.errors.email && "Invalid email"}
      />
      <TextInput
        type="password"
        required
        label="Password"
        placeholder="Your password"
        value={form.values.password}
        onChange={(event) =>
          form.setFieldValue("password", event.currentTarget.value)
        }
        error={
          form.errors.password &&
          "Password should include at least 6 characters"
        }
      />
      <Checkbox
        required
        label="I accept terms and conditions"
        checked={form.values.terms}
        onChange={(event) =>
          form.setFieldValue("terms", event.currentTarget.checked)
        }
      />
      <div>
        <button
          className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
