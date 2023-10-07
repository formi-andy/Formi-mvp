import { mutation, query, QueryCtx } from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser } from "./users";
import sanitizeHtml from "sanitize-html";

export const getCase = query({
  args: {
    id: v.id("cases"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const temp = await ctx.db.get(id);
    if (!temp) {
      throw new ConvexError({
        message: "Case not found",
        code: 404,
      });
    }

    await verifyCareTeam(ctx, user._id, temp.user_id);

    return temp;
  },
});

export const updateCase = mutation({
  args: {
    id: v.id("cases"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    medical_history: v.optional(v.any()),
    // patient: v.optional(v.id("users")),
    patient: v.optional(
      v.union(
        v.string(),
        v.object({
          first_name: v.string(),
          last_name: v.string(),
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    diagnosis: v.optional(v.array(v.any())),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const {
      id,
      title,
      description,
      type,
      medical_history,
      patient,
      tags,
      diagnosis,
    } = args;

    const temp = await ctx.db.get(id);
    if (!temp) {
      throw new ConvexError({
        message: "Case not found",
        code: 404,
      });
    }

    if (temp.user_id !== user._id) {
      throw new ConvexError({
        message: "Unauthenticated call to get case",
        code: 401,
      });
    }

    const sanitizedDescription = sanitizeHtml(description || "");

    await ctx.db.patch(id, {
      title,
      description,
      type,
      medical_history,
      patient,
      tags,
      diagnosis,
    });

    return {
      ...temp,
      title,
      description: sanitizedDescription,
      type,
      medical_history,
      patient,
      tags,
      diagnosis,
    };
  },
});

export const listCases = query({
  args: {
    patientId: v.optional(v.id("users")),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);
    const patientId = args.patientId || user._id;

    await verifyCareTeam(ctx, user._id, patientId);

    const cases = await ctx.db
      .query("cases")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .order("desc")
      .collect();

    const casesByDay: Record<string, typeof cases> = {};
    cases.forEach((temp) => {
      const date = new Date(temp._creationTime).toLocaleDateString("en-US", {
        timeZone: args.timezone,
      });
      casesByDay[date] = casesByDay[date] || [];
      casesByDay[date].push(temp);
    });

    return Object.keys(casesByDay)
      .map((key) => ({
        date: casesByDay[key][0]._creationTime,
        cases: casesByDay[key],
      }))
      .sort((a, b) => b.cases[0]._creationTime - a.cases[0]._creationTime);
  },
});

export const deleteCases = mutation({
  args: {
    ids: v.array(v.id("cases")),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { ids } = args;

    await Promise.all(
      ids.map(async (id) => {
        const temp = await ctx.db.get(id);
        if (!temp) {
          throw new Error("Case not found");
        }

        if (temp.user_id !== user._id) {
          throw new Error("Unauthorized call to delete image");
        }

        await ctx.db.delete(id);
      })
    );

    return ids;
  },
});

// Helpers
// Is this needed here?
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
