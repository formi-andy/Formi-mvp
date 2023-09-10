import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Homescope",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
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
          <Header />
          <Notifications />
          <div className="px-4 md:px-8 w-full flex flex-col h-fit min-h-[calc(100vh_-_152px)]">
            {children}
          </div>
        </MantineProvider>
        <Footer />
      </body>
    </html>
  );
}
