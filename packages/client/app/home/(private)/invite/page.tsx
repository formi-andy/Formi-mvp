import { auth, clerkClient } from "@clerk/nextjs";

import PatientInvites from "@/components/CareTeam/Invite/PatientInvites";
import DoctorInvites from "@/components/CareTeam/Invite/DoctorInvites";
import NotFoundPage from "../../../not-found";
import InviteTop from "@/components/CareTeam/Invite/InviteTop";

export default async function Invite() {
  const { userId } = auth();

  if (!userId) {
    return <NotFoundPage />;
  }

  const user = await clerkClient.users.getUser(userId);

  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <InviteTop role={user.publicMetadata.role as string} />
      {user.publicMetadata.role === "doctor" ? (
        <DoctorInvites />
      ) : (
        <PatientInvites />
      )}
    </div>
  );
}
