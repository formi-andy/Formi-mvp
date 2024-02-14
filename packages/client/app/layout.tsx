import { ReactNode } from "react";

import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeProviders from "@/context/ThemeProviders";

export const metadata = {
  title: "Formi",
  description: "",
};

const inter = Inter({
  variable: "--inter-font",
  subsets: ["latin"],
});

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
        <body className={`h-fit ${inter.className}`}>
          <Toaster />
          <NextTopLoader showSpinner={false} />
          <ThemeProviders
            attribute="class"
            defaultTheme="light"
            // enableSystem
            disableTransitionOnChange
          >
            <MantineProvider
              theme={{
                fontFamily: "var(--inter-font)",
              }}
            >
              <Notifications autoClose={3000} />
              {children}
            </MantineProvider>
          </ThemeProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
