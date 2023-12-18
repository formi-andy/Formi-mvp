import { auth } from "@clerk/nextjs";
import { ReactNode } from "react";
import AdminHeader from "@/components/Header/AdminHeader";
import { redirect } from "next/navigation";
import ConvexContext from "@/context/ConvexContext";
import Footer from "@/components/Footer/Footer";

const FORMI_IDS = new Set([
  "user_2Y8E6xTTJMOXrw7LlXPxTX2tK8T",
  "user_2ZdvNSfHXfWDTjEiiJQdCyQ8myJ",
  "user_2ZdvbZ3Ok1rhFLMGWzdzRW0aToh",
  "user_2ZjZF2ilDSqWyef19QQkSewt2eS",
]);

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = auth();

  const isFormiId = FORMI_IDS?.has(userId ?? "");

  if (!isFormiId && process.env.NODE_ENV === "production") {
    // redirect to home page
    const url = "https://www.formi.health/login";
    redirect(url);
  }

  return (
    <ConvexContext>
      <AdminHeader />
      <div className="px-8 py-4">{children}</div>
      <Footer />
    </ConvexContext>
  );
}
