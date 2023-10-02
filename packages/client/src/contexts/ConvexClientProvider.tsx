import { ReactNode } from "react";
import ConvexContext from "./ConvexContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default async function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexContext>
      <Header />
      <div className="px-4 md:px-8 flex flex-col h-fit min-h-[calc(100vh_-_152px)]">
        {children}
      </div>
      <Footer />
    </ConvexContext>
  );
}