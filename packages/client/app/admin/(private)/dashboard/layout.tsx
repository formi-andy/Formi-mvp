import { auth } from "@clerk/nextjs";
import { ReactNode } from "react";
import AdminHeader from "@/components/Header/AdminHeader";
import { redirect } from "next/navigation";
import ConvexContext from "@/context/ConvexContext";
import Footer from "@/components/Footer/Footer";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = auth();

  // check if user has formi.health email
  const hasFormiEmail = user?.emailAddresses.some((email) =>
    email.emailAddress.endsWith("@formi.health")
  );

  // if (!hasFormiEmail) {
  //   // redirect to home page
  //   const url =
  //     process.env.NODE_ENV === "production"
  //       ? "https://formi.health/login"
  //       : "http://localhost:3000/login";
  //   redirect(url);
  // }

  return (
    <ConvexContext>
      <AdminHeader />
      <div className="px-8 py-4">{children}</div>
      <Footer />
    </ConvexContext>
  );
}
