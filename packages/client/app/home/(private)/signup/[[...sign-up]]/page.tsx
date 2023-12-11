"use client";

import { SignUp as ClerkSignUp, useAuth } from "@clerk/nextjs";
import LockedSignup from "@/components/Locked/LockedAuth";
import { useState } from "react";
import AppLoader from "@/components/Loaders/AppLoader";
import { useParams, usePathname } from "next/navigation";

const SIGNUP_URLS = [
  "/signup/sso-callback",
  "/signup/verify-email-address",
  "/signup/continue",
];

const SignUp = () => {
  const pathname = usePathname();

  const { isSignedIn, isLoaded } = useAuth();
  const [verified, setVerified] = useState(false);

  if (!isLoaded) {
    return <AppLoader />;
  }

  return (
    <div className="flex flex-1 h-[calc(100vh_-_152px)] justify-center items-center flex-col w-full">
      {isSignedIn || verified || SIGNUP_URLS.includes(pathname) ? (
        <ClerkSignUp
          path="/signup"
          redirectUrl={"dashboard"}
          unsafeMetadata={{ tutorial: false }}
        />
      ) : (
        <LockedSignup setVerified={setVerified} />
      )}
    </div>
  );
};

export default SignUp;
