import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/** Get images by Clerk user id (AKA "subject" on auth)  */
export const getImages = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return await imageQuery(ctx, args.subject);
  },
});

/** Create a new Clerk user or update existing Clerk user data. */
export const storeImage = internalMutation({
  args: { storageId: v.string(), author: v.string() },
  async handler(
    ctx,
    { storageId, author }: { storageId: string; author: string }
  ) {
    const storageRecord = await ctx.db.insert("images", {
      storage_id: storageId,
      user_id: author,
      title: "",
      tags: [],
    });

    return storageRecord;
  },
});

export const listImages = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db.query("images").collect();
    return Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await ctx.storage.getUrl(image.storage_id),
      }))
    );
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
