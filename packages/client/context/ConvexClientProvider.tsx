import { ReactNode } from "react";
import ConvexContext from "@/context/ConvexContext";
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
      {children}
    </ConvexContext>
  );
}
