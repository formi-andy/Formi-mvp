import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AuthContext from "@/contexts/Authcontext";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <AuthContext>{children}</AuthContext>;
}
