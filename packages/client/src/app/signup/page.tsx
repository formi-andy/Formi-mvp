import Link from "next/link";
import Image from "next/image";

import LoginButton from "@/components/auth/login/LoginButton";
import SignupForm from "@/components/auth/signup/SignupForm";

const SignUp = () => {
  return (
    <div className="flex flex-1 justify-center items-center flex-col w-full">
      <p className="text-3xl font-semibold pb-8">Sign up for Homescope</p>
      {/* <div className="flex w-fit min-w-[400px] max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-zinc-800 lg:max-w-4xl"> */}
      <div className="flex w-fit min-w-[400px] max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
        <div className="flex flex-col items-center gap-y-4 w-full max-w-sm p-6 m-auto mx-auto">
          <div className="flex justify-center mx-auto">
            <Image width={40} height={40} src={"/assets/logo.svg"} alt="logo" />
          </div>
          <SignupForm />
          <div className="w-full flex items-center justify-between">
            <span className="flex flex-1 border-b" />
            <p className="w-fit px-4 text-xs text-center uppercase">
              other sign up methods
            </p>
            <span className="flex flex-1 border-b" />
          </div>
          <LoginButton />
          <div className="text-xs font-light text-center whitespace-pre">
            Have an account?{" "}
            <Link href="/login" className="font-medium hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
