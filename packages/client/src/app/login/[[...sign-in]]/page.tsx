import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="flex flex-1 justify-center items-center flex-col w-full">
      <SignIn redirectUrl={"/dashboard"} />
    </div>
  );
}
