import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header/Header";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import Footer from "@/components/Footer/Footer";
import { Notifications } from "@mantine/notifications";

export const metadata = {
  title: "Homescope",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="h-fit">
        <Header />
        <MantineProvider>
          <Notifications />
          <div className="px-4 md:px-8 w-full">{children}</div>
        </MantineProvider>
        <Footer />
      </body>
    </html>
  );
}
