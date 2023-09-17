"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient, ConvexProvider } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ClerkConvexAdapter({ convex }: { convex: ConvexReactClient }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      convex.setAuth(async () =>
        getToken({ template: "convex", skipCache: true })
      );
    } else {
      convex.clearAuth();
    }
  }, [getToken, isSignedIn, convex]);
  return null;
}

export default function ConvexContext({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ClerkConvexAdapter convex={convex} />
      {children}
    </ConvexProvider>
  );
}
