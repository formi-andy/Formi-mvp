import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { mustGetCurrentUser } from "./users";
import { Doc, Id } from "./_generated/dataModel";
import _ from "lodash";

export const getChats = query({
  args: {},
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const chats = await ctx.db
      .query("chat")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .order("desc")
      .collect();

    if (!chats) {
      return null;
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

    const messages = await ctx.db
      .query("message")
      .withIndex("by_chat_id_and_index", (q) => q.eq("chat_id", chat._id))
      .order("asc")
      .collect();

    return {
      ...chat,
      messages,
    };
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

    const messages = await ctx.db
      .query("message")
      .withIndex("by_chat_id", (q) => q.eq("chat_id", chat._id))
      .collect();

    await Promise.all(
      messages.map((message) => {
        return ctx.db.delete(message._id);
      })
    );

    return ctx.db.delete(id);
  },
});

export const createChat = mutation({
  args: {
    title: v.string(),
  },
  async handler(ctx, { title }) {
    const user = await mustGetCurrentUser(ctx);

    return ctx.db.insert("chat", {
      title,
      created_at: Date.now(),
      user_id: user._id,
      archived: false,
    });
  },
});

export const createMessage = mutation({
  args: {
    chat_id: v.id("chat"),
    content: v.string(),
    index: v.number(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  async handler(ctx, { chat_id, content, role, index }) {
    const user = await mustGetCurrentUser(ctx);

    const chat = await ctx.db.get(chat_id);

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

    return ctx.db.insert("message", {
      content,
      index,
      chat_id,
      user_id: user._id,
      role,
    });
  },
});

export const createReport = mutation({
  args: {
    chat_id: v.id("chat"),
    content: v.string(),
  },
  async handler(ctx, { chat_id, content }) {
    const user = await mustGetCurrentUser(ctx);

    const chat = await ctx.db.get(chat_id);

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

    const existingReport = await ctx.db
      .query("report")
      .withIndex("by_chat_id", (q) => q.eq("chat_id", chat_id))
      .first();

    if (existingReport) {
      throw new ConvexError({
        code: 409,
        message: "Report already exists",
      });
    }

    return ctx.db.insert("report", {
      content,
      chat_id,
      user_id: user._id,
      sent: false,
      updated_at: Date.now(),
    });
  },
});

export const saveReport = mutation({
  args: {
    id: v.id("report"),
    content: v.string(),
  },
  async handler(ctx, { id, content }) {
    const user = await mustGetCurrentUser(ctx);

    const report = await ctx.db.get(id);

    if (report?.user_id !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "Unauthorized",
      });
    }

    if (!report) {
      throw new ConvexError({
        code: 404,
        message: "Not found",
      });
    }

    return ctx.db.patch(id, {
      content,
      updated_at: Date.now(),
    });
  },
});

export const sendReport = mutation({
  args: {
    id: v.id("report"),
    content: v.string(),
  },
  async handler(ctx, { id, content }) {
    const user = await mustGetCurrentUser(ctx);

    const report = await ctx.db.get(id);

    if (report?.user_id !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "Unauthorized",
      });
    }

    if (!report) {
      throw new ConvexError({
        code: 404,
        message: "Not found",
      });
    }

    return ctx.db.patch(id, {
      content,
      updated_at: Date.now(),
      sent: true,
      sent_at: Date.now(),
    });
  },
});

export const getReport = query({
  args: {
    id: v.id("report"),
  },
  async handler(ctx, { id }) {
    const user = await mustGetCurrentUser(ctx);

    const report = await ctx.db.get(id);

    if (report?.user_id !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "Unauthorized",
      });
    }

    if (!report) {
      throw new ConvexError({
        code: 404,
        message: "Not found",
      });
    }

    return report;
  },
});

export const getReportByChat = query({
  args: {
    chat_id: v.id("chat"),
  },
  async handler(ctx, { chat_id }) {
    const user = await mustGetCurrentUser(ctx);

    const report = await ctx.db
      .query("report")
      .withIndex("by_chat_id", (q) => q.eq("chat_id", chat_id))
      .first();

    if (!report) {
      return null;
    }

    return report;
  },
});
