import { ReactNode } from "react";
import ConvexContext from "./ConvexContext";
import Header from "@/components/Header/Header";

export default function ConvexClientProvider({
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
