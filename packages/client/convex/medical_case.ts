import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { CaseStatus } from "../types/case-types";

import { ConvexError, v, Value } from "convex/values";
import { mustGetCurrentUser, mustGetUserById } from "./users";
import sanitizeHtml from "sanitize-html";
import { getImageByCaseId, getImagesByCaseId } from "./images";
import { getReviewsByCaseId, getReviewsByUser } from "./review";
import { ReviewStatus } from "../types/review-types";
import { createHistory, getHistoryByProfile, updateHistory } from "./history";
import { UserRole } from "../types/role-types";
import { internal } from "./_generated/api";

export const getMedicalCase = internalQuery({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const { id } = args;

    const medicalCase = await ctx.db.get(id);
    if (!medicalCase) {
      throw new ConvexError({
        message: "Medical case not found",
        code: 404,
      });
    }

    return medicalCase;
  },
});

export const getMedicalCaseWithImageAndPatient = query({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const medicalCase = await mustGetMedicalCase(ctx, id);

    const patient = await mustGetUserById(ctx, medicalCase.patient_id);

    if (medicalCase.user_id !== user._id || patient._id !== user._id) {
      throw new ConvexError({
        message: "Unauthenticated call to get this medical case",
        code: 401,
      });
    }

    // get all images and reviews for this case
    const [images, reviews] = await Promise.all([
      getImagesByCaseId(ctx, { case_id: medicalCase._id }),
      getReviewsByCaseId(ctx, {
        case_id: medicalCase._id,
      }),
    ]);

    const completedReviews = reviews.filter(
      (review) => review.status === ReviewStatus.Completed
    );

    // get urls for all images
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storage_id);
        return {
          ...image,
          url,
        };
      })
    );

    // await verifyCareTeam(ctx, user._id, medicalCase.user_id);

    return {
      ...medicalCase,
      images: imagesWithUrls,
      patient,
      reviews: completedReviews,
    };
  },
});

export const getAnonymizedMedicalCase = query({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id } = args;

    const medicalCase = await mustGetMedicalCase(ctx, id);

    if (
      user.role !== UserRole.MedicalStudent ||
      !medicalCase.reviewers.includes(user._id)
    ) {
      throw new ConvexError({
        message: "Unauthenticated call to get medical case",
        code: 401,
      });
    }

    const images = await getImagesByCaseId(ctx, { case_id: medicalCase._id });

    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const url = await ctx.storage.getUrl(image.storage_id);
        return {
          ...image,
          url,
        };
      })
    );

    const { user_id, ...medicalCaseWithoutUserId } = medicalCase;

    // await verifyCareTeam(ctx, user._id, medicalCase.user_id);

    return {
      ...medicalCaseWithoutUserId,
      images: imagesWithUrls,
    };
  },
});

export const internalGetMedicalCase = internalQuery({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const { id } = args;

    const medicalCase = await mustGetMedicalCase(ctx, id);

    // await verifyCareTeam(ctx, user._id, medicalCase.user_id);

    return {
      ...medicalCase,
    };
  },
});

export const addReviewerToMedicalCase = mutation({
  args: {
    id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const { id } = args;
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Invalid permissions",
        code: 403,
      });
    }

    const medicalCase = await mustGetMedicalCase(ctx, id);

    const reviewerSet = new Set(medicalCase.reviewers);
    const reviewers = medicalCase.reviewers;

    if (reviewerSet.has(user._id)) {
      throw new ConvexError({
        message: "You are already a reviewer for this case",
        code: 400,
      });
    }

    if (reviewers.length >= medicalCase.max_reviewers) {
      throw new ConvexError({
        message: "Max reviewers for this case has been reached",
        code: 400,
      });
    }

    const reviews = await ctx.db
      .query("review")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .filter((q) => q.eq(q.field("status"), ReviewStatus.Created))
      .collect();

    if (reviews.length > 0) {
      throw new ConvexError({
        message: "You are already reviewing another case",
        code: 400,
      });
    }

    reviewers.push(user._id);

    await Promise.all([
      ctx.db.patch(id, {
        status: CaseStatus.Reviewing,
        reviewers,
      }),
      ctx.db.insert("review", {
        case_id: id,
        user_id: user._id,
        notes: "",
        status: ReviewStatus.Created,
        updated_at: Date.now(),
      }),
    ]);

    return {
      ...medicalCase,
      reviewers,
    };
  },
});

export const createMedicalCase = internalMutation({
  args: {
    questions: v.any(),
    chief_complaint: v.string(),
    // patient_id: v.id("users"),
    patient_id: v.string(),
    medical_history: v.any(),
    duration: v.string(),
    profile: v.object({
      user_id: v.optional(v.id("users")),
      first_name: v.string(),
      last_name: v.string(),
      ethnicity: v.array(v.string()),
      date_of_birth: v.number(),
      sex_at_birth: v.string(),
      state: v.string(),
      pediatric_patient: v.boolean(),
    }),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const {
      patient_id,
      questions,
      duration,
      chief_complaint,
      medical_history,
      profile,
    } = args;

    const normalizedId = ctx.db.normalizeId("profile", patient_id);

    if (!profile) {
      throw new ConvexError({
        message: "Profile is required",
        code: 400,
      });
    }

    if (!normalizedId) {
      const profileRecord = await ctx.db.insert("profile", {
        ...profile,
        created_by: user._id,
      });
      await createHistory(ctx, {
        profile_id: profileRecord,
        ...medical_history,
      });
    } else {
      await ctx.db.patch(normalizedId, profile);
      const previousHistory = await getHistoryByProfile(ctx, {
        profile_id: normalizedId,
      });
      if (!previousHistory) {
        throw new ConvexError({
          message: "Medical history not found",
          code: 404,
        });
      }
      await updateHistory(ctx, {
        id: previousHistory._id,
        ...medical_history,
      });
    }

    // duplicate medical history and profile to medical case
    const caseRecord = await ctx.db.insert("medical_case", {
      medical_history,
      questions,
      patient_id: user._id,
      chief_complaint,
      user_id: user._id,
      reviewers: [],
      status: CaseStatus.Created,
      max_reviewers: 3,
      duration,
      profile,
    });

    return { caseRecord, userId: user._id };
  },
});

export const createMedicalCaseAction = action({
  args: {
    questions: v.any(),
    chief_complaint: v.string(),
    // patient_id: v.id("users"),
    patient_id: v.string(),
    medical_history: v.any(),
    duration: v.string(),
    profile: v.object({
      user_id: v.optional(v.id("users")),
      first_name: v.string(),
      last_name: v.string(),
      ethnicity: v.array(v.string()),
      date_of_birth: v.number(),
      sex_at_birth: v.string(),
      state: v.string(),
      pediatric_patient: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const { profile } = args;
    const res = await ctx.runMutation(
      internal.medical_case.createMedicalCase,
      args
    );
    const caseRecord: Id<"medical_case"> = res.caseRecord;
    const userId = res.userId;
    await slackCaseCreation(ctx, {
      user_id: userId,
      case_id: caseRecord,
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
    return { caseRecord };
  },
});

export const getCompletedMedicalCasesByReviewer = query({
  args: {
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Invalid permissions",
        code: 403,
      });
    }
    // await verifyCareTeam(ctx, user._id, patientId);

    // TODO: need to make this more efficient
    const reviews = await getReviewsByUser(ctx, {
      status: ReviewStatus.Completed,
    });
    const reviewsWithCases = await Promise.all(
      reviews.map(async (review) => {
        const medicalCase = await mustGetMedicalCase(ctx, review.case_id);
        const image = await getImageByCaseId(ctx, {
          case_id: medicalCase._id,
        });
        const url = (await ctx.storage.getUrl(image.storage_id)) || "";

        return {
          ...medicalCase,
          image_url: url,
          _creationTime: review.updated_at,
        };
      })
    );

    const medicalCasesByDay: Record<string, typeof reviewsWithCases> = {};

    reviewsWithCases.forEach((medicalCase) => {
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

export const listMedicalCasesByUser = query({
  args: {
    user_id: v.optional(v.id("users")),
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);
    const patientId = args.user_id || user._id;

    // await verifyCareTeam(ctx, user._id, patientId);

    const medicalCases = await ctx.db
      .query("medical_case")
      .withIndex("by_user_id", (q) => q.eq("user_id", patientId))
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

// TODO: obfuscate case data until review process is initiated
export const listClaimableMedicalCases = query({
  args: {
    timezone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Invalid permissions",
        code: 403,
      });
    }

    const medicalCases = (
      await ctx.db.query("medical_case").order("desc").collect()
    ).filter(
      ({ reviewers, max_reviewers }) =>
        !reviewers.includes(user._id) && reviewers.length < max_reviewers
    );

    const medicalCasesWithImage = await Promise.all(
      medicalCases.map(async (medicalCase) => {
        const image = await getImageByCaseId(ctx, { case_id: medicalCase._id });
        const url = (await ctx.storage.getUrl(image.storage_id)) || "";

        return {
          ...medicalCase,
          image_url: url,
        };
      })
    );

    const medicalCasesByDay: Record<string, typeof medicalCasesWithImage> = {};

    medicalCasesWithImage.forEach((medicalCase) => {
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
        const medicalCase = await mustGetMedicalCase(ctx, id);

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

export const reviewCallback = internalMutation({
  args: {
    id: v.id("medical_case"),
    reviews: v.array(v.any()),
  },
  async handler(ctx, args) {
    const { id, reviews } = args;

    const medicalCase = await mustGetMedicalCase(ctx, id);

    // create new reviews
    const caseReviews = await Promise.all(
      reviews.map(async (review) => {
        const reviewRecord = await ctx.db.insert("review", review);
        return reviewRecord;
      })
    );

    return ctx.db.patch(id, {
      reviewed_at: Date.now(),
    });
  },
});

export const caseFeedback = mutation({
  args: {
    id: v.id("medical_case"),
    feedback: v.string(),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const { id, feedback } = args;

    const medicalCase = await mustGetMedicalCase(ctx, id);

    if (medicalCase.user_id !== user._id) {
      throw new ConvexError({
        message: "Unauthorized call to delete image",
        code: 401,
      });
    }

    // send notifs to reviewers?

    return ctx.db.patch(id, {
      feedback,
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

export async function mustGetMedicalCase(
  ctx: QueryCtx,
  case_id: Id<"medical_case">
): Promise<Doc<"medical_case">> {
  const caseRecord = await ctx.db.get(case_id);
  if (!caseRecord)
    throw new ConvexError({
      message: "Medical case not found",
      code: 404,
    });
  return caseRecord;
}

export const slackCaseCreation = internalAction({
  args: {
    user_id: v.id("users"),
    case_id: v.id("medical_case"),
    first_name: v.string(),
    last_name: v.string(),
  },
  handler: async (ctx, args) => {
    const isProd = !!process.env.PROD;

    if (!isProd) {
      return;
    }

    const { user_id, case_id, first_name, last_name } = args;
    await fetch(process.env.SLACK_WEBHOOK_URL || "", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Case Created",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Case ID: ${case_id}\n User ID: ${user_id}\nName: ${first_name} ${last_name}`,
            },
          },
        ],
      }),
    });
  },
});
