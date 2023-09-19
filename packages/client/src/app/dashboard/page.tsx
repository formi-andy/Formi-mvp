import Gallery from "@/components/Gallery/Gallery";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs";
import { User } from "next-auth";

export default async function Dashboard() {
  const user: User | null = await currentUser();

  return <Gallery />;
}
