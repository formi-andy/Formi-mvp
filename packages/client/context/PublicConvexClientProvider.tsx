import { ReactNode } from "react";
import ConvexContext from "@/context/ConvexContext";
import PublicFooter from "@/components/Footer/PublicFooter";
import PublicHeader from "@/components/Header/PublicHeader";

export default async function PublicConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexContext>
      <PublicHeader />
      <div>{children}</div>
      <PublicFooter />
    </ConvexContext>
  );
}
