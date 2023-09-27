import { mutation, internalMutation, query, action } from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser } from "./users";

export const getActionItems = query({
  args: {
    created_by: v.optional(v.array(v.string())),
    completed: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { created_by, completed } = args;

    const actionItems = await ctx.db
      .query("action_item")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .order("desc")
      .collect();

    // TODO: replace with joins when supported, also add filters potentially
    return Promise.all(
      actionItems.map(async (item) => {
        let clerkUser = await ctx.db.get(user._id);

        return {
          ...item,
          created_by: {
            _id: item.created_by,
            imageUrl: clerkUser?.clerkUser.profile_image_url,
            firstName: clerkUser?.clerkUser.first_name,
            lastName: clerkUser?.clerkUser.last_name,
          },
        };
      })
    );
  },
});

export const addActionItem = mutation({
  args: {
    patientId: v.string(),
    createdBy: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    completionTime: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { patientId, createdBy, title, description, completionTime } = args;

    const patientDoctor = await ctx.db
      .query("patient_doctor")
      .withIndex("by_patient_id_and_doctor_id", (q) =>
        q.eq("patient_id", patientId).eq("doctor_id", createdBy)
      )
      .first();

    if (!patientDoctor || patientDoctor.doctor_id !== user._id) {
      throw new ConvexError({
        message: "User does not have permission to add action item",
        code: 400,
      });
    }

    return ctx.db.insert("action_item", {
      user_id: patientId,
      created_by: createdBy,
      title,
      description,
      completion_time: completionTime,
      updated_at: Date.now(),
      completed: false,
    });
  },
});

export const updateActionItem = mutation({
  args: {
    id: v.id("action_item"),
    title: v.string(),
    description: v.optional(v.string()),
    completionTime: v.optional(v.number()),
    completed: v.boolean(),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id, title, description, completionTime, completed } = args;

    const actionItem = await ctx.db.get(id);

    if (!actionItem) {
      throw new ConvexError({
        message: "Action item does not exist",
        code: 400,
      });
    }

    if (actionItem.created_by !== user._id) {
      throw new ConvexError({
        message: "User does not have permission to update",
        code: 403,
      });
    }

    return ctx.db.patch(id, {
      title,
      description,
      completion_time: completionTime,
      updated_at: Date.now(),
      completed,
    });
  },
});

export const deleteActionItem = mutation({
  args: {
    id: v.id("action_item"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const actionItem = await ctx.db.get(id);

    if (!actionItem) {
      throw new ConvexError({
        message: "Action item does not exist",
        code: 400,
      });
    }

    if (actionItem.created_by !== user._id) {
      throw new ConvexError({
        message: "User does not have permission to update",
        code: 403,
      });
    }

    return ctx.db.delete(id);
  },
});
