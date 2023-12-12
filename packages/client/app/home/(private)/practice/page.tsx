import NotFoundPage from "@/app/not-found";
import AppLoader from "@/components/Loaders/AppLoader";
import Question from "@/components/Practice/Question";
import { UserRole } from "@/types/role-types";
import clerkClient from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs";

// TODO: Move this to ssr after convex supports server side reactive queries
export default async function PracticePage() {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId || "");

  if (user === undefined) {
    return <AppLoader />;
  }

  // generate random string as hash
  const hash = Math.random().toString(36).substring(7);

  if (user.publicMetadata.role === UserRole.MedicalStudent) {
    return (
      <div>
        <Question hash={hash} />
      </div>
    );
  }

  return <NotFoundPage />;
}
