import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { mustGetCurrentUser, mustGetUserById } from "./users";

export const getHistory = query({
  args: {
    id: v.id("history"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const history = await mustGetHistory(ctx, id);

    if (history?.user_id === user._id || history.created_by === user._id) {
      return { history };
    } else {
      throw new ConvexError({
        message: "Unauthenticated call to get this history",
        code: 403,
      });
    }
  },
});

export async function mustGetHistory(
  ctx: QueryCtx,
  id: Id<"history">
): Promise<Doc<"history">> {
  const history = await ctx.db.get(id);
  if (!history) {
    throw new ConvexError({ message: "History not found", code: 404 });
  }
  return history;
}

export const createHistory = mutation({
  args: {
    user_id: v.optional(v.id("users")),
    // medical history questions
    immunizations: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    allergies_medical: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    medications: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    chronic_conditions: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    reproductive_issues: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    surgeries: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    hospitalizations: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    birth_type: v.optional(v.string()),
    weeks_born_at: v.optional(v.number()),
    birth_weight: v.optional(
      v.object({
        answer: v.number(),
        select: v.string(),
      })
    ),
    birth_complications: v.optional(
      v.object({
        answer: v.boolean(),
        description: v.optional(v.string()),
      })
    ),
    // family history questions
    asthma: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    allergies_family: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    cancer: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    diabetes: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    hypertension: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    gastrointestinal: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    other: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    // social history questions
    smoking: v.boolean(),
    alcohol: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    drugs: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    sexual_activity: v.object({
      answer: v.boolean(),
      description: v.optional(v.string()),
    }),
    home_situation: v.optional(v.string()),
    physical_activity: v.optional(
      v.object({
        answer: v.boolean(),
        description: v.optional(v.string()),
      })
    ),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const {
      user_id,
      immunizations,
      allergies_medical,
      medications,
      chronic_conditions,
      reproductive_issues,
      surgeries,
      hospitalizations,
      birth_type,
      weeks_born_at,
      birth_weight,
      birth_complications,
      asthma,
      allergies_family,
      cancer,
      diabetes,
      hypertension,
      gastrointestinal,
      other,
      smoking,
      alcohol,
      drugs,
      sexual_activity,
      home_situation,
      physical_activity,
    } = args;

    let normalizedUserId;
    if (user_id) {
      normalizedUserId = ctx.db.normalizeId("users", user_id);
    }

    const historyRecord = await ctx.db.insert("history", {
      user_id: normalizedUserId as Id<"users">,
      created_by: user._id,
      immunizations,
      allergies_medical,
      medications,
      chronic_conditions,
      reproductive_issues,
      surgeries,
      hospitalizations,
      birth_type,
      weeks_born_at,
      birth_weight,
      birth_complications,
      asthma,
      allergies_family,
      cancer,
      diabetes,
      hypertension,
      gastrointestinal,
      other,
      smoking,
      alcohol,
      drugs,
      sexual_activity,
      home_situation,
      physical_activity,
    });

    return { historyRecord };
  },
});

export const updateHistory = {};
