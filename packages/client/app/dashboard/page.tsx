import DoctorDashboardView from "@/components/Dashboard/DoctorDashboardView";
import PatientCaseGallery from "@/components/Dashboard/Gallery/PatientCaseGallery";
import PlatformTutorial from "@/components/Record/Instructions/PlatformTutorial";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";
// import Gallery from "@/components/Gallery/Gallery";
// import CareTeam from "@/components/CareTeam/CareTeam";
// import ActionItems from "@/components/ActionItems/ActionItems";

export default async function Dashboard() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  console.log(user.unsafeMetadata, "tutorial" in user?.unsafeMetadata);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 md:gap-6 lg:gap-8">
      {/* <div className="w-full lg:w-3/5 flex flex-col border rounded-lg p-4 lg:p-8 gap-4">
        <Gallery />
      </div>
      <div className="flex w-full lg:w-2/5 flex-col gap-4 md:gap-6 lg:gap-8">
        <CareTeam />
        <ActionItems />
      </div> */}
      <div className="w-full flex flex-col border rounded-lg p-4 lg:p-8 gap-4">
        {user.publicMetadata.role === "patient" ? (
          <>
            {"tutorial" in user?.unsafeMetadata && <PlatformTutorial />}
            <PatientCaseGallery />
          </>
        ) : (
          <DoctorDashboardView />
        )}
      </div>
    </div>
  );
}
