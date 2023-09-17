import { ReactNode } from "react";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";
import ConvexClientProvider from "@/contexts/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

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
            <Notifications />
            <div className="px-4 md:px-8 w-full flex flex-col h-fit min-h-[calc(100vh_-_80px)]">
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </div>
          </MantineProvider>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
