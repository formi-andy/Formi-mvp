import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Checkbox } from "@mantine/core";
import { BsGoogle } from "react-icons/bs";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
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

  const navigate = useNavigate();

  const register = () => {
    const auth = getAuth();

    const { values } = form;

    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // The user account was created successfully
        const user = userCredential.user;
        console.log("User account created:", user);
        navigate("/view");
      })
      .catch((error) => {
        // There was an error creating the user account
        console.error("Error creating user account:", error);
      });
  };

  return (
    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
        }}
      />

      <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white dark:bg-gray-800">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
            alt=""
          />
        </div>

        <form
          className="flex flex-col gap-y-4"
          onSubmit={form.onSubmit(() => {})}
        >
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
            radius="md"
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
            radius="md"
          />

          <TextInput
            styles={{
              label: {
                fontWeight: 400,
                marginBottom: "0.5rem",
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
            radius="md"
          />

          <PasswordInput
            styles={{
              label: {
                fontWeight: 400,
                marginBottom: "0.5rem",
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
            radius="md"
          />

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
              onClick={register}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
          <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
            other sign up methods
          </p>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
        </div>
        <div className="flex items-center mt-6 -mx-2">
          <button
            type="button"
            className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
          >
            <BsGoogle />
            <span className="hidden mx-2 sm:inline">Sign Up with Google</span>
          </button>
        </div>
        <p className="mt-8 text-xs font-light text-center text-gray-400">
          {" "}
          Have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
