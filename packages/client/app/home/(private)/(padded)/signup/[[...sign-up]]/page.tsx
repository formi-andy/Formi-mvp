"use client";

import { SignUp as ClerkSignUp, useAuth } from "@clerk/nextjs";
import LockedSignup from "@/components/Locked/LockedAuth";
import { useEffect, useState } from "react";
import AppLoader from "@/components/Loaders/AppLoader";
import { useParams, usePathname } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";

const SIGNUP_URLS = [
  "/signup/sso-callback",
  "/signup/verify-email-address",
  "/signup/continue",
];

const SignUp = () => {
  const pathname = usePathname();

  const { isSignedIn, isLoaded } = useAuth();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useLocalStorage<string>({
    key: "formi-password",
    defaultValue: undefined,
  });

  useEffect(() => {
    async function checkPassword(password: string) {
      const { data } = await axios.post("/api/check-password", {
        password,
      });
      if (data.verified) {
        setVerified(true);
        setPassword(data.password);
      }
      setLoading(false);
    }
    if (verified || isSignedIn) {
      return;
    }

    if (password) {
      checkPassword(password);
    }
  }, [password, setPassword, isSignedIn, verified]);

  if (!isLoaded || loading) {
    return <AppLoader />;
  }
  
  return (
    <div className="grid w-full h-full items-center justify-center">
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
