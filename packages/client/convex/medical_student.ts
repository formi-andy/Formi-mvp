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

export const getClerkUserFromAction = internalMutation({
  args: {},
  handler: async (ctx, {}) => {
    const user = await mustGetCurrentUser(ctx);
    return user.clerkUser.id;
  },
});

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
      school,
      email,
      bio,
      blurb,
    });
    return medicalStudent;
  },
});

export const verifyEmail = action({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const clerkUserId = await ctx.runMutation(
      internal.medical_student.getClerkUserFromAction
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
          role: "medical_student",
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
      internal.medical_student.getClerkUserFromAction
    );
    await clerkClient.users.updateUserMetadata(clerkUser, {
      publicMetadata: {
        student_email: email,
      },
    });
  },
});
