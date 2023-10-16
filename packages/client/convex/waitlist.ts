import { mutation } from "./_generated/server";

import { ConvexError, v } from "convex/values";

export const joinWaitlist = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  async handler(
    ctx,
    { email, name, phone }: { email: string; name?: string; phone?: string }
  ) {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (existing) {
      throw new ConvexError({
        message: "Already on waitlist",
        code: 409,
      });
    }
    return ctx.db.insert("waitlist", {
      email,
      name,
      phone,
    });
  },
});
