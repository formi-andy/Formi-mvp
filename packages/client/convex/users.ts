import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import clerkClient, { UserJSON } from "@clerk/clerk-sdk-node";
import {
  deleteMedicalStudentByUserId,
  getMedicalStudent,
} from "./medical_student";
import { internal } from "./_generated/api";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // no JWT token, user hasn't completed login flow yet
      return ["No JWT Token", null];
    }
    const user = await getCurrentUser(ctx);
    if (user === null) {
      // If Clerk has not told us about this user we're still waiting for the
      // webhook notification.
      return ["No Clerk User", null];
    }
    return ["Logged In", user];
  }
);

/** The current user, containing user preferences and Clerk user info. */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

/** Get user by convex id */
export const getUser = internalQuery({
  args: { id: v.id("users") },
  async handler(ctx, args) {
    return ctx.db.get(args.id);
  },
});

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getClerkUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await userQuery(ctx, args.subject);
  },
});

/** Create a new Clerk user or update existing Clerk user data. */
export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await userQuery(ctx, clerkUser.id);

    try {
      if (userRecord === null) {
        const colors = ["red", "green", "blue"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        await ctx.db.insert("users", { clerkUser, color, role: null });
        return;
      }

      if (userRecord.role === "patient" || userRecord.role === null) {
        await ctx.db.patch(userRecord._id, { clerkUser });
        return;
      }

      const oldStudentEmail = userRecord.clerkUser.public_metadata
        .student_email as string | undefined;

      const studentEmail = clerkUser.email_addresses.find(
        (emailAddress) => emailAddress.email_address === oldStudentEmail
      );

      if (
        (studentEmail && studentEmail.verification?.status === "verified") ||
        !oldStudentEmail
      ) {
        await ctx.db.patch(userRecord._id, { clerkUser });
      } else {
        await ctx.db.patch(userRecord._id, {
          clerkUser,
          role: null,
        });
        await deleteMedicalStudentByUserId(ctx, { userId: userRecord._id });
        return { clearMetadata: true };
      }
    } catch (e) {
      console.log("error updating user", e);
    }
  },
});

export const updateOrCreateUserAction = internalAction({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const res = await ctx.runMutation(internal.users.updateOrCreateUser, {
      clerkUser,
    });

    if (res?.clearMetadata) {
      await clerkClient.users.updateUserMetadata(clerkUser.id, {
        publicMetadata: {
          student_email: null,
          role: null,
        },
      });
    }
  },
});

export const setPatientRole = internalMutation({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);
    await ctx.db.patch(user._id, { role: "patient" });
    return user;
  },
});

export const setPatientAction = action({
  args: {},
  async handler(ctx) {
    const user = await ctx.runMutation(internal.users.setPatientRole);
    await clerkClient.users.updateUserMetadata(user.clerkUser.id, {
      publicMetadata: {
        role: "patient",
        student_email: null,
      },
    });
  },
});

/** Delete a user by clerk user ID. */
export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id);

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(userRecord._id);
    }
  },
});

/** Set the user preference of the color of their text. */
export const setColor = mutation({
  args: { color: v.string() },
  handler: async (ctx, { color }) => {
    const user = await mustGetCurrentUser(ctx);
    await ctx.db.patch(user._id, { color });
  },
});

// Helpers

export async function userQuery(
  ctx: QueryCtx,
  clerkUserId: string
): Promise<(Omit<Doc<"users">, "clerkUser"> & { clerkUser: UserJSON }) | null> {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUserId))
    .unique();
}

export async function userById(
  ctx: QueryCtx,
  id: Id<"users">
): Promise<(Omit<Doc<"users">, "clerkUser"> & { clerkUser: UserJSON }) | null> {
  return await ctx.db.get(id);
}

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userQuery(ctx, identity.subject);
}

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord)
    throw new ConvexError({
      message: "Not authenticated",
      code: 401,
    });
  return userRecord;
}

export async function mustGetUserById(
  ctx: QueryCtx,
  id: Id<"users">
): Promise<Doc<"users">> {
  const userRecord = await getUser(ctx, { id });
  if (!userRecord)
    throw new ConvexError({
      message: "User not found",
      code: 404,
    });
  return userRecord;
}

export const getClerkUserForAction = internalMutation({
  args: {},
  handler: async (ctx, {}) => {
    const user = await mustGetCurrentUser(ctx);
    return user.clerkUser.id;
  },
});
