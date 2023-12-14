import DoctorDashboard from "@/components/Dashboard/DoctorDashboard";
import PatientCaseGallery from "@/components/Dashboard/Gallery/PatientCaseGallery";
import { UserRole } from "@/types/role-types";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";
import style from "../../../../components/Dashboard/doctorgallery.module.css";
// import Gallery from "@/components/Gallery/Gallery";
// import CareTeam from "@/components/CareTeam/CareTeam";
// import ActionItems from "@/components/ActionItems/ActionItems";

export default async function Dashboard() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  return (
    <>
      <div className="grid min-h-screen relative">
        {/* <div className="w-full lg:w-3/5 flex flex-col border rounded-lg p-4 lg:p-8 gap-4">
        <Gallery />
      </div>
      <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8">
        <CareTeam />
        <ActionItems />
      </div> */}
        {user.publicMetadata.role === UserRole.Patient ? (
          <PatientCaseGallery />
        ) : (
          <DoctorDashboard />
        )}
      </div>
      {user.publicMetadata.role !== UserRole.Patient && (
        <div className={`${style.bg3}`} />
      )}
    </>
  );
}
