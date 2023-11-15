import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="flex flex-1 h-[calc(100vh_-_152px)] justify-center items-center flex-col w-full">
      <SignIn path="/login" redirectUrl={"/dashboard"} />
    </div>
  );
}
