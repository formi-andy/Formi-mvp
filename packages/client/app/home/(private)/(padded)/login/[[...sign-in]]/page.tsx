"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import LockedAuth from "@/components/Locked/LockedAuth";
import { useEffect, useState } from "react";
import AppLoader from "@/components/Loaders/AppLoader";
import { usePathname } from "next/navigation";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";

const SIGNIN_URLS = ["/login/factor-one", "/login/sso-callback"];

const Login = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
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
      {isSignedIn || verified || SIGNIN_URLS.includes(pathname) ? (
        <SignIn path="/login" redirectUrl={"/dashboard"} />
      ) : (
        <LockedAuth setVerified={setVerified} />
      )}
    </div>
  );
};

export default Login;
