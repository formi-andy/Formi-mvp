import {
  mutation,
  internalMutation,
  query,
  QueryCtx,
  internalQuery,
} from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser } from "./users";
import sanitizeHtml from "sanitize-html";

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
      title,
      case_id: "",
    });

    return { storageRecord, patientId: patientId || user._id };
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

    await verifyCareTeam(ctx, user._id, image.user_id);

    return {
      ...image,
      url: (await ctx.storage.getUrl(image.storage_id)) || "",
    };
  },
});

export const getImageByStorageId = internalQuery({
  args: {
    storageId: v.string(),
  },
  async handler(ctx, args) {
    const { storageId } = args;

    const image = await ctx.db
      .query("images")
      .withIndex("by_storage_id", (q) => q.eq("storage_id", storageId))
      .first();
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    return image;
  },
});

// TODO: use patient ID
export const updateImage = mutation({
  args: {
    id: v.id("images"),
    title: v.string(),
    patient_id: v.optional(v.id("users")),
    description: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id, title, patient_id, description } = args;

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

    const sanitizedDescription = sanitizeHtml(description || "");

    await ctx.db.patch(id, {
      title,
      description,
    });

    return {
      ...image,
      title,
      description: sanitizedDescription,
    };
  },
});

export const diagnosisCallback = internalMutation({
  args: {
    id: v.id("images"),
    diagnosis: v.array(v.any()),
  },
  async handler(ctx, args) {
    const { id, diagnosis } = args;

    const image = await ctx.db.get(id);
    if (!image) {
      throw new ConvexError({
        message: "Image not found",
        code: 404,
      });
    }

    // await ctx.db.patch(id, {
    //   diagnosis,
    // });

    return {
      ...image,
    };
  },
});

export const listImages = query({
  args: {
    patientId: v.optional(v.id("users")),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);
    const patientId = args.patientId || user._id;

    await verifyCareTeam(ctx, user._id, patientId);

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
      const date = new Date(image._creationTime).toLocaleDateString("en-US", {
        timeZone: args.timezone,
      });
      imagesByDay[date] = imagesByDay[date] || [];
      imagesByDay[date].push(image);
    });

    return Object.keys(imagesByDay)
      .map((key) => ({
        date: imagesByDay[key][0]._creationTime,
        images: imagesByDay[key],
      }))
      .sort((a, b) => b.images[0]._creationTime - a.images[0]._creationTime);
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

// Helpers

export async function verifyCareTeam(
  ctx: QueryCtx,
  userId: string,
  patientId: string
): Promise<boolean | null> {
  const patientDoctors = await ctx.db
    .query("patient_doctor")
    .withIndex("by_patient_id", (q) => q.eq("patient_id", patientId))
    .collect();

  const viewerSet = new Set([
    patientId,
    ...(patientDoctors.map((pd) => pd.doctor_id) as string[]),
  ]);

  if (!viewerSet.has(userId)) {
    throw new ConvexError({
      message: "Invalid permissions",
      code: 401,
    });
  }

  return true;
}
