import Link from "next/link";
import Image from "next/image";

import LoginButton from "@/components/auth/login/LoginButton";
import SignupForm from "@/components/auth/signup/SignupForm";

const SignUp = () => {
  return (
    <div className="flex p-8 flex-col gap-y-4  w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
      <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
        }}
      />

      <div className="flex justify-center mx-auto">
        <Image
          width={64}
          height={64}
          alt="logo"
          // className="w-auto h-7 sm:h-8"
          src="https://merakiui.com/images/logo.svg"
        />
      </div>

      <SignupForm />
      <p className="text-xs border-y py-4 text-center uppercase border-neutral-400">
        other sign up methods
      </p>
      <LoginButton />
      <div className="text-sm flex gap-x-2 items-center justify-center">
        <Link
          href="/signin"
          className="w-fit font-medium text-gray-700 dark:text-gray-200 hover:underline"
        >
          Have an account? Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
