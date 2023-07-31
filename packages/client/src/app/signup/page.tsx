import Link from "next/link";
import Image from "next/image";

import LoginButton from "@/components/auth/login/LoginButton";
import SignupForm from "@/components/auth/signup/SignupForm";

const SignUp = () => {
  return (
    <div className="flex p-8 items-center flex-col gap-y-4 w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-zinc-800 lg:max-w-4xl">
      {/* <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
        }}
      /> */}

      <div className="flex justify-center mx-auto">
        <Image
          width={64}
          height={64}
          alt="logo"
          src="https://merakiui.com/images/logo.svg"
        />
      </div>

      <SignupForm />
      <div className="w-full flex items-center justify-between">
        <span className="flex flex-1 border-b"></span>
        <p className="w-fit px-4 text-xs text-center uppercase">
          other sign up methods
        </p>
        <span className="flex flex-1 border-b"></span>
      </div>
      <LoginButton />
      <div className="text-xs font-light text-center whitespace-pre">
        Have an account?{" "}
        <Link href="/login" className="font-medium hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
