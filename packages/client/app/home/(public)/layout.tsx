import { ReactNode } from "react";
import PublicConvexClientProvider from "@/context/PublicConvexClientProvider";

export const metadata = {
  title: "Formi",
  description: "",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-col h-fit">
      <PublicConvexClientProvider>{children}</PublicConvexClientProvider>
    </div>
  );
}
