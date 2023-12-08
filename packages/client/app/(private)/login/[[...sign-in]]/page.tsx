"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import LockedAuth from "@/components/Locked/LockedAuth";
import { useState } from "react";
import AppLoader from "@/components/Loaders/AppLoader";
import { usePathname } from "next/navigation";

const SIGNIN_URLS = ["/login/factor-one"];

const Login = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [verified, setVerified] = useState(false);

  if (!isLoaded) {
    return <AppLoader />;
  }

  return (
    <div className="flex flex-1 h-[calc(100vh_-_152px)] justify-center items-center flex-col w-full">
      {isSignedIn || verified || SIGNIN_URLS.includes(pathname) ? (
        <SignIn path="/login" redirectUrl={"/dashboard"} />
      ) : (
        <LockedAuth setVerified={setVerified} />
      )}
    </div>
  );
};

export default Login;
