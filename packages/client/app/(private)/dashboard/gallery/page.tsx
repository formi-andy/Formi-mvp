import DoctorCaseGallery from "@/components/Dashboard/DoctorCaseGallery";
import DoctorDashboard from "@/components/Dashboard/DoctorDashboard";
import PatientCaseGallery from "@/components/Dashboard/Gallery/PatientCaseGallery";
import { UserRole } from "@/types/role-types";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";
// import Gallery from "@/components/Gallery/Gallery";
// import CareTeam from "@/components/CareTeam/CareTeam";
// import ActionItems from "@/components/ActionItems/ActionItems";

export default async function GalleryPage() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  if (user.publicMetadata.role === UserRole.Patient) {
    // navigate to /dashboard
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
      <DoctorCaseGallery />
    </div>
  );
}
