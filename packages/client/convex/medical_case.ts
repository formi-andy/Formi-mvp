import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { getUser, mustGetCurrentUser, mustGetUserById } from "./users";
import sanitizeHtml from "sanitize-html";
import { Id } from "./_generated/dataModel";
import { getImageByCaseId } from "./images";

export const getMedicalCase = query({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const medicalCase = await ctx.db.get(id);
    if (!medicalCase) {
      throw new ConvexError({
        message: "Medical case not found",
        code: 404,
      });
    }

    const patient = await mustGetUserById(ctx, medicalCase.patient_id);

    if (medicalCase.user_id !== user._id || patient._id !== user._id) {
      throw new ConvexError({
        message: "Unauthenticated call to get medical case",
        code: 401,
      });
    }

    // await verifyCareTeam(ctx, user._id, medicalCase.user_id);

    return {
      ...medicalCase,
      patient,
    };
  },
});

export const updateMedicalCase = mutation({
  args: {
    id: v.id("medical_case"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    medical_history: v.optional(v.any()),
    tags: v.optional(v.array(v.string())),
    diagnosis: v.optional(v.array(v.any())),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id, title, description, medical_history, tags, diagnosis } = args;

    const medicalCase = await ctx.db.get(id);
    if (!medicalCase) {
      throw new ConvexError({
        message: "Medical case not found",
        code: 404,
      });
    }

    if (medicalCase.user_id !== user._id) {
      throw new ConvexError({
        message: "Unauthenticated call to get medical case",
        code: 401,
      });
    }

    const sanitizedDescription = sanitizeHtml(description || "");

    await ctx.db.patch(id, {
      title,
      description,
      medical_history,
      tags,
      diagnosis,
    });

    return {
      ...medicalCase,
      title,
      description: sanitizedDescription,
      medical_history,
      tags,
      diagnosis,
    };
  },
});

export const createMedicalCase = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    symptom_areas: v.array(v.string()),
    medical_history: v.any(),
    // patient_id: v.id("users"),
    patient_id: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const {
      title,
      description,
      patient_id,
      medical_history,
      tags,
      symptom_areas,
    } = args;

    const sanitizedDescription = sanitizeHtml(description || "");

    const patient = await getUser(ctx, { id: patient_id as Id<"users"> });

    const caseRecord = await ctx.db.insert("medical_case", {
      title,
      symptom_areas,
      description: sanitizedDescription,
      medical_history,
      tags: tags || [],
      patient_id: patient ? patient._id : user._id,
      diagnosis: [],
      user_id: user._id,
    });
    return { caseRecord };
  },
});

export const listMedicalCases = query({
  args: {
    patient_id: v.optional(v.id("users")),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);
    const patientId = args.patient_id || user._id;

    // await verifyCareTeam(ctx, user._id, patientId);

    const medicalCases = await ctx.db
      .query("medical_case")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .order("desc")
      .collect();

    const medicalCasesWithPatient = await Promise.all(
      medicalCases.map(async (medicalCase) => {
        const patient = await mustGetUserById(ctx, medicalCase.patient_id);
        const image = await getImageByCaseId(ctx, { case_id: medicalCase._id });
        const url = (await ctx.storage.getUrl(image.storage_id)) || "";

        return {
          ...medicalCase,
          patient,
          image_url: url,
        };
      })
    );

    const medicalCasesByDay: Record<string, typeof medicalCasesWithPatient> =
      {};

    medicalCasesWithPatient.forEach((medicalCase) => {
      const date = new Date(medicalCase._creationTime).toLocaleDateString(
        "en-US",
        {
          timeZone: args.timezone,
        }
      );
      medicalCasesByDay[date] = medicalCasesByDay[date] || [];
      medicalCasesByDay[date].push(medicalCase);
    });

    return Object.keys(medicalCasesByDay)
      .map((key) => ({
        date: medicalCasesByDay[key][0]._creationTime,
        medicalCases: medicalCasesByDay[key],
      }))
      .sort(
        (a, b) =>
          b.medicalCases[0]._creationTime - a.medicalCases[0]._creationTime
      );
  },
});

export const deleteCases = mutation({
  args: {
    ids: v.array(v.id("medical_case")),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { ids } = args;

    await Promise.all(
      ids.map(async (id) => {
        const medicalCase = await ctx.db.get(id);
        if (!medicalCase) {
          throw new ConvexError({
            message: "Medical case not found",
            code: 404,
          });
        }

        if (medicalCase.user_id !== user._id) {
          throw new ConvexError({
            message: "Unauthorized call to delete image",
            code: 401,
          });
        }

        await ctx.db.delete(id);
      })
    );

    return ids;
  },
});

export const diagnosisCallback = internalMutation({
  args: {
    id: v.id("medical_case"),
    diagnosis: v.array(v.any()),
  },
  async handler(ctx, args) {
    const { id, diagnosis } = args;

    const medicalCase = await ctx.db.get(id);
    if (!medicalCase) {
      throw new ConvexError({
        message: "Medical case not found",
        code: 404,
      });
    }

    return ctx.db.patch(id, {
      diagnosis,
    });
  },
});

// Helpers
export async function verifyCareTeam(
  ctx: QueryCtx,
  userId: string,
  patient_id: string
): Promise<boolean | null> {
  const patientDoctors = await ctx.db
    .query("patient_doctor")
    .withIndex("by_patient_id", (q) => q.eq("patient_id", patient_id))
    .collect();

  const viewerSet = new Set([
    patient_id,
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
