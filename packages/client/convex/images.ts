import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import dayjs from "dayjs";

/** Get images by Clerk user id (AKA "subject" on auth)  */
export const getImages = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await imageQuery(ctx, args.subject);
  },
});

export const storeImage = internalMutation({
  args: {
    storageId: v.string(),
    author: v.string(),
    patientId: v.optional(v.string()),
    title: v.string(),
  },
  async handler(
    ctx,
    {
      storageId,
      author,
      patientId,
      title,
    }: { storageId: string; author: string; patientId?: string; title: string }
  ) {
    const storageRecord = await ctx.db.insert("images", {
      storage_id: storageId,
      user_id: author,
      patient_id: patientId,
      title,
      tags: [],
    });

    return storageRecord;
  },
});

export const listImages = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to get images");
    }
    const { subject } = identity;
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_id", (q) => q.eq("user_id", subject))
      .order("desc")
      .collect();

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: (await ctx.storage.getUrl(image.storage_id)) || "",
      }))
    );

    const imagesByDay: Record<string, typeof imagesWithUrls> = {};
    imagesWithUrls.forEach((image) => {
      const date = dayjs(image._creationTime).format("M/DD/YYYY");
      if (!imagesByDay[date]) {
        imagesByDay[date] = [];
      }
      imagesByDay[date].push(image);
    });

    return imagesByDay;
  },
});

// Helpers
export async function imageQuery(
  ctx: QueryCtx,
  clerkUserId: string
): Promise<any> {
  return await ctx.db
    .query("images")
    .withIndex("by_user_id", (q) => q.eq("user_id", clerkUserId))
    .unique();
}
