import Image from "next/image";
import Link from "next/link";
import LoginButton from "@/components/auth/login/LoginButton";
import LoginForm from "@/components/auth/login/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-1 justify-center items-center flex-col w-full">
      <p className="text-3xl font-semibold pb-8">Log in to Homescope</p>
      {/* <div className="flex w-fit min-w-[400px] max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-zinc-800 lg:max-w-4xl"> */}
      <div className="flex w-fit min-w-[400px] max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg  lg:max-w-4xl">
        <div className="flex flex-col items-center gap-y-4 w-full max-w-sm p-6 m-auto mx-auto">
          <div className="flex justify-center mx-auto">
            <Image width={40} height={40} src={"/assets/logo.svg"} alt="logo" />
          </div>
          <LoginForm />
          <div className="w-full flex items-center justify-between">
            <span className="flex flex-1 border-b" />
            <p className="w-fit px-4 text-xs text-center uppercase">
              other log in methods
            </p>
            <span className="flex flex-1 border-b" />
          </div>
          <LoginButton />
          <div className="text-xs font-light text-center whitespace-pre">
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
