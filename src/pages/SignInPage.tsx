import React from "react";
import { Link } from "react-router-dom";
import { BsGoogle } from "react-icons/bs";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Checkbox } from "@mantine/core";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const logIn = () => {
    const auth = getAuth();

    const { values } = form;

    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // The user signed in successfully
        const user = userCredential.user;
        console.log("User signed in:", user);
        navigate("/view");
      })
      .catch((error) => {
        // There was an error signing in the user
        console.error("Error signing in user:", error);
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
        <form className="mt-6">
          <TextInput
            styles={{
              label: {
                fontWeight: 400,
                marginBottom: "0.5rem",
              },
            }}
            label="Email"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            radius="md"
          />

          <PasswordInput
            styles={{
              label: {
                fontWeight: 400,
                marginBottom: "0.5rem",
              },
            }}
            label="Password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue("password", event.currentTarget.value)
            }
            radius="md"
          />
          <div className="mt-6">
            <button
              className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              onClick={logIn}
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
          <p className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
            other sign in methods
          </p>
          <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
        </div>
        <div className="flex items-center mt-6 -mx-2">
          <button
            type="button"
            className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
          >
            <BsGoogle />
            <span className="hidden mx-2 sm:inline">Sign in with Google</span>
          </button>
        </div>
        <p className="mt-8 text-xs font-light text-center text-gray-400">
          {" "}
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-gray-700 dark:text-gray-200 hover:underline"
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
