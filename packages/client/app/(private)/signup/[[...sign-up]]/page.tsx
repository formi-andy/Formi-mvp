"use client";

import { SignUp as ClerkSignUp, useAuth } from "@clerk/nextjs";
import LockedSignup from "@/components/Locked/LockedAuth";
import { useState } from "react";
import AppLoader from "@/components/Loaders/AppLoader";

const SignUp = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [verified, setVerified] = useState(false);

  if (!isLoaded) {
    return <AppLoader />;
  }

  return (
    <div className="flex flex-1 h-[calc(100vh_-_152px)] justify-center items-center flex-col w-full">
      {isSignedIn || verified ? (
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
