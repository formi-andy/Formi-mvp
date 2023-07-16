import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/auth/login/LoginButton";
import LoginForm from "@/components/auth/login/LoginForm";

export default function Login() {
  return (
    <div className="flex items-center flex-col p-4 w-full">
      <p className="text-3xl font-semibold pb-8">Log in to Homescope</p>
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
        {/* <div
        className="hidden bg-cover lg:block lg:w-1/2"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')",
        }}
      /> */}
        <div className="flex flex-col items-center gap-y-4 w-full max-w-sm p-6 m-auto mx-auto bg-white dark:bg-gray-800">
          <div className="flex justify-center mx-auto">
            <Image
              width={64}
              height={64}
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt="logo"
            />
          </div>
          <LoginForm />
          <div className="w-full flex items-center justify-between text-black">
            <span className="flex flex-1 border-b border-black" />
            <p className="w-fit px-4 text-xs text-center uppercase">
              other sign in methods
            </p>
            <span className="flex flex-1 border-b border-black" />
          </div>
          <LoginButton />
          <div className="text-xs font-light text-center text-black whitespace-pre">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium hover:underline">
              Create One
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
