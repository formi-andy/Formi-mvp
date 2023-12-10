import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { mustGetCurrentUser } from "./users";

import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { clerkClient, UserJSON } from "@clerk/clerk-sdk-node";
import { internal } from "./_generated/api";
import { UserRole } from "../types/role-types";

export const createMedicalStudent = internalMutation({
  args: {
    school: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    blurb: v.optional(v.string()),
  },
  handler: async (ctx, { school, email, bio, blurb }) => {
    const user = await mustGetCurrentUser(ctx);
    const medicalStudent = await ctx.db.insert("medical_student", {
      user_id: user._id,
      total_reviews: 0,
      correct_reviews: 0,
      incorrect_reviews: 0,
      school,
      email,
      bio,
      blurb,
    });
    await ctx.db.patch(user._id, {
      role: UserRole.MedicalStudent,
    });
    return medicalStudent;
  },
});

export const getMedicalStudent = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("medical_student")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .first();
  },
});

export async function mustGetMedicalStudentbyId(
  ctx: QueryCtx,
  userId: Id<"users">
) {
  const userRecord = await getMedicalStudent(ctx, { userId });
  if (!userRecord)
    throw new ConvexError({
      message: "User not found",
      code: 404,
    });

  return userRecord;
}

export const deleteMedicalStudentByUserId = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const medicalStudent = await getMedicalStudent(ctx, { userId });
    if (medicalStudent) {
      await ctx.db.delete(medicalStudent._id);
    }
  },
});

export const verifyEmail = action({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    if (!email.endsWith(".edu")) {
      throw new ConvexError({
        message: "Email not .edu",
        code: 401,
      });
    }

    const clerkUserId = await ctx.runMutation(
      internal.users.getClerkUserForAction
    );
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const schoolEmail = clerkUser.emailAddresses.find(
      (emailAddress) => emailAddress.emailAddress === email
    );

    if (!schoolEmail || schoolEmail.verification?.status !== "verified") {
      throw new ConvexError({
        message: "Email not verified",
        code: 401,
      });
    }

    const school = schoolEmail.emailAddress.split("@")[1];

    await Promise.all([
      clerkClient.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: {
          student_email: email,
          role: UserRole.MedicalStudent,
        },
      }),
      ctx.runMutation(internal.medical_student.createMedicalStudent, {
        school,
        email,
      }),
    ]);
  },
});

export const setEmailMetadata = action({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const clerkUser = await ctx.runMutation(
      internal.users.getClerkUserForAction
    );
    await clerkClient.users.updateUserMetadata(clerkUser, {
      publicMetadata: {
        student_email: email,
      },
    });
  },
});
