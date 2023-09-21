import { ReactNode } from "react";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";
import ConvexClientProvider from "@/contexts/ConvexClientProvider";

import { ClerkProvider } from "@clerk/nextjs";
import "@mantine/notifications/styles.css";

export const metadata = {
  title: "Homescope",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link
            rel="apple-touch-icon"
            href="/apple-touch-icon.png"
            type="image/png"
            sizes="180x180"
          />
          <ColorSchemeScript />
        </head>
        <body className="h-fit">
          <NextTopLoader showSpinner={false} />
          <MantineProvider>
            <Notifications autoClose={3000} />
            <div className="w-full flex flex-col h-fit">
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </div>
          </MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
