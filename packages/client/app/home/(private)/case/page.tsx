import DoctorCaseGallery from "@/components/Dashboard/DoctorCaseGallery";
import { UserRole } from "@/types/role-types";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function GalleryPage() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  if (user.publicMetadata.role === UserRole.Patient) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <DoctorCaseGallery />
    </div>
  );
}
