import { mutation } from "./_generated/server";

import { v } from "convex/values";

export const createContactUsMessage = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  async handler(
    ctx,
    {
      email,
      name,
      phone,
      subject,
      message,
    }: {
      email: string;
      name: string;
      phone?: string;
      subject: string;
      message: string;
    }
  ) {
    return ctx.db.insert("contact_us_message", {
      email,
      name,
      phone,
      subject,
      message,
    });
  },
});
