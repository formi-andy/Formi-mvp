import type { NextAuthOptions } from "next-auth";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from "@/lib/firestore";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter(firestore),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
