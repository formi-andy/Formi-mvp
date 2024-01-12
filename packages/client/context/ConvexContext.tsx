"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import AppLoader from "@/components/Loaders/AppLoader";
import { initAmplitude } from "@/utils/initAmplitude";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ClerkConvexAdapter({
  convex,
  setLoading,
}: {
  convex: ConvexReactClient;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    setLoading(true);
    if (isSignedIn) {
      convex.setAuth(
        async () => getToken({ template: "convex", skipCache: true }),
        () => setLoading(false)
      );
    } else {
      convex.clearAuth();
      setLoading(false);
    }
  }, [getToken, isSignedIn, convex, setLoading, isLoaded]);
  return null;
}

export default function ConvexContext({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  initAmplitude();

  return (
    <ConvexProvider client={convex}>
      <ClerkConvexAdapter convex={convex} setLoading={setLoading} />
      {loading ? <AppLoader /> : children}
    </ConvexProvider>
  );
}
