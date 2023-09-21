import { mutation, internalMutation, query } from "./_generated/server";

import { ConvexError, v } from "convex/values";
import dayjs from "dayjs";

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

export const getImage = query({
  args: {
    id: v.id("images"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Unauthenticated call to get image",
        code: 401,
      });
    }

    const { id } = args;

    const image = await ctx.db.get(id);
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    return {
      ...image,
      url: (await ctx.storage.getUrl(image.storage_id)) || "",
    };
  },
});

// TODO: use patient ID
export const updateImage = mutation({
  args: {
    id: v.id("images"),
    title: v.string(),
    patient_id: v.optional(v.id("users")),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Unauthenticated call to get image",
        code: 401,
      });
    }

    const { id, title, patient_id, description, tags } = args;

    const image = await ctx.db.get(id);
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    if (image.user_id !== identity.subject) {
      throw new ConvexError({
        message: "Unauthenticated call to get image",
        code: 401,
      });
    }

    await ctx.db.patch(id, {
      title,
      description,
      tags,
    });

    return {
      ...image,
      title,
      description,
      tags,
    };
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

export const deleteImages = mutation({
  args: {
    ids: v.array(v.id("images")),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to delete images");
    }

    const { ids } = args;

    await Promise.all(
      ids.map(async (id) => {
        const image = await ctx.db.get(id);
        if (!image) {
          throw new Error("Image not found");
        }

        if (image.user_id !== identity.subject) {
          throw new Error("Unauthorized call to delete image");
        }

        await ctx.db.delete(id);
        await ctx.storage.delete(image.storage_id);
      })
    );

    return ids;
  },
});
