import NotFoundPage from "@/app/not-found";
import AppLoader from "@/components/Loaders/AppLoader";
import { UserRole } from "@/types/role-types";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";

// TODO: Move this to ssr after convex supports server side reactive queries
export default async function CasePracticePage() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  if (user === undefined) {
    return <AppLoader />;
  }

  if (user.publicMetadata.role === UserRole.MedicalStudent) {
    return <div>hi</div>;
  }

  return <NotFoundPage />;
}
