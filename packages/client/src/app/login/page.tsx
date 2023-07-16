import LoginButton from "@/components/Login/LoginButton";

export default function Login() {
  return (
    <div className="flex items-center flex-col p-4 w-fit">
      <p className="text-3xl font-semibold pb-8">Log in to Homescope</p>
      <div className="flex flex-col gap-y-2">
        <LoginButton />
      </div>
    </div>
  );
}
