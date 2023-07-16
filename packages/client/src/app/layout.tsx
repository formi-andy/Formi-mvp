import { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header/Header";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">
        <Header />
        <MantineProvider>
          <div className="px-4 md:px-8 w-full">{children}</div>
        </MantineProvider>
      </body>
    </html>
  );
}
