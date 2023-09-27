import { mutation, internalMutation, query } from "./_generated/server";

import { ConvexError, v } from "convex/values";
import dayjs from "dayjs";
import { mustGetCurrentUser } from "./users";

export const storeImage = internalMutation({
  args: {
    storageId: v.string(),
    patientId: v.union(v.id("users"), v.null()),
    title: v.string(),
  },
  async handler(
    ctx,
    {
      storageId,
      patientId,
      title,
    }: { storageId: string; patientId: string | null; title: string }
  ) {
    const user = await mustGetCurrentUser(ctx);
    const storageRecord = await ctx.db.insert("images", {
      storage_id: storageId,
      user_id: user._id,
      patient_id: patientId || user._id,
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
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const image = await ctx.db.get(id);
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    const patientDoctors = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id", (q) =>
        q.eq("patient_id", image.patient_id as string)
      )
      .collect();

    const viewerSet = new Set([
      image.user_id,
      ...(patientDoctors.map((pd) => pd.doctor_id) as string[]),
    ]);

    if (!viewerSet.has(user._id)) {
      throw new ConvexError({
        message: "Unauthenticated call to get image",
        code: 401,
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
    const user = await mustGetCurrentUser(ctx);

    const { id, title, patient_id, description, tags } = args;

    const image = await ctx.db.get(id);
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    if (image.user_id !== user._id) {
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
    const user = await mustGetCurrentUser(ctx);
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
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
    const user = await mustGetCurrentUser(ctx);

    const { ids } = args;

    await Promise.all(
      ids.map(async (id) => {
        const image = await ctx.db.get(id);
        if (!image) {
          throw new Error("Image not found");
        }

        if (image.user_id !== user._id) {
          throw new Error("Unauthorized call to delete image");
        }

        await ctx.db.delete(id);
        await ctx.storage.delete(image.storage_id);
      })
    );

    return ids;
  },
});
