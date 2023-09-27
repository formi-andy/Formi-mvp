import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { mustGetCurrentUser } from "./users";
import { addPatientDoctor } from "./patient_doctor";
import { Id } from "./_generated/dataModel";
import generateRandomString from "../src/utils/generateRandomString";

export const generateInviteCode = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== "doctor") {
      throw new ConvexError({
        message: "Invalid permissions",
        code: 400,
      });
    }

    const existingInvite = await ctx.db
      .query("invite_code")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .first();

    const code = generateRandomString();

    if (existingInvite) {
      await ctx.db.patch(existingInvite._id, { code });
      return code;
    }

    await ctx.db.insert("invite_code", {
      code,
      user_id: user._id,
    });

    return code;
  },
});

export const getUserInviteCode = query({
  args: {},
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== "doctor") {
      throw new ConvexError({
        message: "Invalid permissions",
        code: 400,
      });
    }

    const invite = await ctx.db
      .query("invite_code")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .first();

    return invite;
  },
});

export const getInviteCode = internalQuery({
  args: { code: v.string() },
  async handler(ctx, { code }) {
    const invite = await ctx.db
      .query("invite_code")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    return invite;
  },
});

// TODO: make more secure later
export const createInvite = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const { code } = args;
    const user = await mustGetCurrentUser(ctx);
    const invite_code = await getInviteCode(ctx, { code });

    if (!invite_code) {
      throw new ConvexError({
        message: "Invalid invite code",
        code: 400,
      });
    }

    await ctx.db.insert("invite", {
      sent_by: user._id,
      sent_to: invite_code.user_id,
      code: invite_code.code,
      accepted: false,
      responded_at: null,
    });
  },
});

export const getInvite = internalQuery({
  args: { id: v.id("invite") },
  async handler(ctx, { id }) {
    const invite = await ctx.db.get(id);
    return invite;
  },
});

export const updateInvite = mutation({
  args: { action: v.boolean(), invite_id: v.id("invite") },
  handler: async (ctx, args) => {
    const { action, invite_id } = args;
    const user = await mustGetCurrentUser(ctx);
    const invite = await getInvite(ctx, { id: invite_id });

    if (!invite) {
      throw new ConvexError({
        message: "Invalid invite",
        code: 400,
      });
    }

    if (invite.sent_to !== user._id || invite.responded_at !== null) {
      throw new ConvexError({
        message: "Invalid invite",
        code: 400,
      });
    }
    await ctx.db.patch(invite_id, {
      accepted: action,
      responded_at: Date.now(),
    });

    if (action) {
      await addPatientDoctor(ctx, {
        patientId: invite.sent_by,
        doctorId: invite.sent_to,
        doctorRole: "Doctor",
      });
    }
  },
});

// TODO: refactor later
export const getPendingInvites = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    let index: "by_sent_by" | "by_sent_to" = "by_sent_by";
    let key: "sent_by" | "sent_to" = "sent_by";

    switch (user.role) {
      case "doctor":
        index = "by_sent_to";
        key = "sent_to";
        break;
      default:
        break;
    }
    const invites = await ctx.db
      .query("invite")
      .withIndex(index, (q) => q.eq(key, user._id).eq("responded_at", null))
      .collect();

    return Promise.all(
      invites.map(async (invite) => {
        const user = await ctx.db.get(invite.sent_by as Id<"users">);
        return {
          ...invite,
          sent_by: {
            id: user?._id,
            imageUrl: user?.clerkUser.image_url,
            firstName: user?.clerkUser.first_name,
            lastName: user?.clerkUser.last_name,
          },
        };
      })
    );
  },
});

export const getPastInvites = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    let index: "by_sent_by" | "by_sent_to" = "by_sent_by";
    let key: "sent_by" | "sent_to" = "sent_by";

    switch (user.role) {
      case "doctor":
        index = "by_sent_to";
        key = "sent_to";
        break;
      default:
        break;
    }
    const invites = await ctx.db
      .query("invite")
      .withIndex(index, (q) => q.eq(key, user._id).gt("responded_at", 0))
      .collect();

    return Promise.all(
      invites.map(async (invite) => {
        const user = await ctx.db.get(invite.sent_by as Id<"users">);
        return {
          ...invite,
          sent_by: {
            id: user?._id,
            imageUrl: user?.clerkUser.image_url,
            firstName: user?.clerkUser.first_name,
            lastName: user?.clerkUser.last_name,
          },
        };
      })
    );
  },
});
