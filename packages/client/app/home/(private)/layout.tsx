import { ReactNode } from "react";
import ConvexClientProvider from "@/context/ConvexClientProvider";

export const metadata = {
  title: "Formi",
  description: "",
};

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-fit min-h-screen">
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </div>
  );
}
