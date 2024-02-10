import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { mustGetCurrentUser } from "./users";
import { Doc, Id } from "./_generated/dataModel";

export const getChats = query({
  args: {},
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .first();

    if (!chats) {
      return [];
    }

    return chats;
  },
});

export const getChat = query({
  args: {
    id: v.id("chat"),
  },
  async handler(ctx, { id }) {
    const user = await mustGetCurrentUser(ctx);

    const chat = await ctx.db.get(id);

    if (chat?.user_id !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "Unauthorized",
      });
    }

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Not found",
      });
    }

    return chat;
  },
});

export const removeChat = mutation({
  args: {
    id: v.id("chat"),
  },
  async handler(ctx, { id }) {
    const user = await mustGetCurrentUser(ctx);

    const chat = await ctx.db.get(id);

    if (chat?.user_id !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "Unauthorized",
      });
    }

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Not found",
      });
    }

    return ctx.db.delete(id);
  },
});
