import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import UnauthorizedError from "../../errors/unauthorized";

export default async function authMiddleware() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new UnauthorizedError("There is no session");
  }

  return session;
}
