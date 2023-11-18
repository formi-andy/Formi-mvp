import { ConvexError, v } from "convex/values";
import { QueryCtx, internalQuery, mutation, query } from "./_generated/server";
import { mustGetCurrentUser, mustGetUserById } from "./users";
import { Id } from "./_generated/dataModel";
import { mustGetMedicalStudentbyId } from "./medical_student";
import sanitizeHtml from "sanitize-html";
import { ReviewStatus } from "../types/review-types";
import { mustGetMedicalCase } from "./medical_case";
import { getImageByCaseId } from "./images";

async function attachUsersAndMedicalStudents(
  ctx: QueryCtx,
  ids: Id<"users">[]
) {
  const promises = ids.map(async (id) => {
    const [user, medicalStudent] = await Promise.all([
      mustGetUserById(ctx, id),
      mustGetMedicalStudentbyId(ctx, id),
    ]);
    return { user, medicalStudent };
  });
  return Promise.all(promises);
}

export const getReviewsByCaseId = internalQuery({
  args: {
    case_id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const { case_id } = args;

    const reviews = await ctx.db
      .query("review")
      .withIndex("by_case_id", (q) => q.eq("case_id", case_id))
      .collect();

    const userIds = reviews.map((review) => review.user_id);
    const users = await attachUsersAndMedicalStudents(ctx, userIds);

    const reviewsWithUsers = reviews.map((review) => {
      const user = users.find((user) => user.user._id === review.user_id);

      if (!user) {
        throw new ConvexError({
          message: "User not found",
          code: 404,
        });
      }

      return {
        ...review,
        user: user.user,
        medical_student: user.medicalStudent,
      };
    });

    return reviewsWithUsers;
  },
});

export const getUserReviewByCaseId = query({
  args: {
    case_id: v.id("medical_case"),
  },
  async handler(ctx, args) {
    const { case_id } = args;

    const user = await mustGetCurrentUser(ctx);

    const medicalCase = await mustGetMedicalCase(ctx, case_id);

    if (medicalCase.reviewers.indexOf(user._id) === -1) {
      throw new ConvexError({
        message: "User not allowed to review this case",
        code: 403,
      });
    }

    const review = await ctx.db
      .query("review")
      .withIndex("by_case_id", (q) => q.eq("case_id", case_id))
      .filter((q) => q.eq(q.field("user_id"), user._id))
      .first();

    return review;
  },
});

export const getReviewsByUser = query({
  args: {
    status: v.optional(
      v.union(
        v.literal(ReviewStatus.Completed),
        v.literal(ReviewStatus.Created)
      )
    ),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    let query = ctx.db
      .query("review")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id));

    switch (args.status) {
      case ReviewStatus.Completed:
        query = query.filter((q) =>
          q.eq(q.field("status"), ReviewStatus.Completed)
        );
        break;
      case ReviewStatus.Created:
        query = query.filter((q) =>
          q.eq(q.field("status"), ReviewStatus.Created)
        );
        break;
      default:
        break;
    }

    const reviews = await query.collect();
    return reviews;
  },
});

export const saveReview = mutation({
  args: {
    case_id: v.id("medical_case"),
    notes: v.string(),
  },
  async handler(ctx, args) {
    const { case_id, notes } = args;

    const user = await mustGetCurrentUser(ctx);

    const existingReview = await ctx.db
      .query("review")
      .withIndex("by_case_id", (q) => q.eq("case_id", case_id))
      .filter((q) => q.eq(q.field("user_id"), user._id))
      .first();

    if (!existingReview) {
      throw new ConvexError({
        message: "Review not found",
        code: 404,
      });
    }

    if (existingReview.status === ReviewStatus.Completed) {
      throw new ConvexError({
        message: "Review already completed",
        code: 400,
      });
    }

    const sanitizedNotes = sanitizeHtml(notes || "");

    return ctx.db.patch(existingReview._id, {
      notes: sanitizedNotes,
      updated_at: Date.now(),
    });
  },
});

export const submitReview = mutation({
  args: {
    case_id: v.id("medical_case"),
    notes: v.string(),
  },
  async handler(ctx, args) {
    const { case_id, notes } = args;

    const [user, medicalCase, existingReviews] = await Promise.all([
      mustGetCurrentUser(ctx),
      mustGetMedicalCase(ctx, case_id),
      ctx.db
        .query("review")
        .withIndex("by_case_id", (q) => q.eq("case_id", case_id))
        .collect(),
    ]);

    const existingReview = existingReviews.find(
      (review) => review.user_id === user._id
    );

    if (!existingReview) {
      throw new ConvexError({
        message: "Review not found",
        code: 404,
      });
    }

    if (existingReview.status === ReviewStatus.Completed) {
      throw new ConvexError({
        message: "Review already completed",
        code: 400,
      });
    }

    const sanitizedNotes = sanitizeHtml(notes || "");

    await ctx.db.patch(existingReview._id, {
      notes: sanitizedNotes,
      status: ReviewStatus.Completed,
      updated_at: Date.now(),
    });

    for (let i = 0; i < existingReviews.length; i++) {
      const review = existingReviews[i];

      if (review.user_id === user._id) {
        existingReviews[i] = {
          ...review,
          status: ReviewStatus.Completed,
        };
      }
    }

    const allReviewsCompleted = existingReviews.every(
      (review) => review.status === ReviewStatus.Completed
    );

    if (
      allReviewsCompleted &&
      existingReviews.length >= medicalCase.max_reviewers
    ) {
      await ctx.db.patch(case_id, {
        status: ReviewStatus.Completed,
      });
    }
  },
});

export const getReviewsByUserAndStatus = query({
  args: {
    status: v.union(
      v.literal(ReviewStatus.Created),
      v.literal(ReviewStatus.Completed)
    ),
  },
  async handler(ctx, args) {
    const { status } = args;

    const user = await mustGetCurrentUser(ctx);

    const reviews = await ctx.db
      .query("review")
      .withIndex("by_user_id_and_status", (q) =>
        q.eq("user_id", user._id).eq("status", status)
      )
      .collect();

    // attach medical case
    const medicalCaseIds = reviews.map((review) => review.case_id);
    const medicalCases = await Promise.all(
      medicalCaseIds.map((id) => mustGetMedicalCase(ctx, id))
    );

    // get patient
    const patientIds = medicalCases.map(
      (medicalCase) => medicalCase.patient_id
    );
    const patients = await Promise.all(
      patientIds.map((id) => mustGetUserById(ctx, id))
    );

    const reviewsWithMedicalCasesWithImage = await Promise.all(
      medicalCases.map(async (medicalCase, index) => {
        const image = await getImageByCaseId(ctx, { case_id: medicalCase._id });
        const url = (await ctx.storage.getUrl(image.storage_id)) || "";

        return {
          ...reviews[index],
          medicalCase: {
            ...medicalCase,
            patient: patients[index],
            image_url: url,
          },
        };
      })
    );

    return reviewsWithMedicalCasesWithImage;
  },
});
