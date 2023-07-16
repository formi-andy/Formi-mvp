"use client";

import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { TextInput, Checkbox } from "@mantine/core";
import { BsGoogle } from "react-icons/bs";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupForm() {
  // const register = () => {
  //   const auth = getAuth();

  //   const { values } = form;

  //   createUserWithEmailAndPassword(auth, values.email, values.password)
  //     .then((userCredential) => {
  //       // The user account was created successfully
  //       const user = userCredential.user;
  //       console.log("User account created:", user);
  //       // navigate("/view");
  //     })
  //     .catch((error) => {
  //       // There was an error creating the user account
  //       console.error("Error creating user account:", error);
  //     });
  // };

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
      password: (val) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
    },
  });

  return (
    <form className="flex flex-col gap-y-4">
      <div className="flex gap-x-4">
        <TextInput
          styles={{
            label: {
              fontWeight: 400,
              marginBottom: "0.5rem",
            },
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
          styles={{
            label: {
              fontWeight: 400,
              marginBottom: "0.5rem",
            },
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
        styles={{
          label: {
            fontWeight: 400,
          },
        }}
        required
        label="Email"
        placeholder="hello@gmail.com"
        value={form.values.email}
        onChange={(event) =>
          form.setFieldValue("email", event.currentTarget.value)
        }
        error={form.errors.email && "Invalid email"}
      />
      {/* 
      <PasswordInput
        styles={{
          label: {
            fontWeight: 400,
          },
        }}
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
      /> */}

      <Checkbox
        required
        label="I accept terms and conditions"
        checked={form.values.terms}
        onChange={(event) =>
          form.setFieldValue("terms", event.currentTarget.checked)
        }
      />

      <div className="mt-6">
        <button
          className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          // onClick={register}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
