import { ConvexError, v } from "convex/values";
import { internalQuery, mutation } from "./_generated/server";
import { mustGetCurrentUser } from "./users";
import { addPatientDoctor } from "./patient_doctors";

export const generateInviteCode = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await mustGetCurrentUser(ctx);
    const code = Math.random().toString(36).substring(2, 15);
    await ctx.db.insert("invite_code", {
      code,
      user_id: user._id,
    });

    return code;
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
      accepted: false,
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

    if (invite.sent_to !== user._id || invite.responded_at) {
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
        doctorRole: "doctor",
      });
    }
  },
});
