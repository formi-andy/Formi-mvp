import { ReactNode } from "react";
import ConvexClientProvider from "@/context/ConvexClientProvider";

export const metadata = {
  title: "Formi",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-fit min-h-screen">
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </div>
  );
}
