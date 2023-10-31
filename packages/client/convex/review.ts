import { ConvexError, v } from "convex/values";
import { QueryCtx, internalQuery, mutation, query } from "./_generated/server";
import { mustGetCurrentUser, mustGetUserById } from "./users";
import { Id } from "./_generated/dataModel";
import { mustGetMedicalStudentbyId } from "./medical_student";
import sanitizeHtml from "sanitize-html";
import { ReviewStatus } from "../types/review-types";
import { mustGetMedicalCase } from "./medical_case";

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

export const getReviewsByUser = query({
  args: {},
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const reviews = await ctx.db
      .query("review")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();

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

    if (existingReview.status === ReviewStatus.COMPLETED) {
      throw new ConvexError({
        message: "Review already completed",
        code: 400,
      });
    }

    const sanitizedNotes = sanitizeHtml(notes || "");

    return ctx.db.patch(existingReview._id, {
      notes: sanitizedNotes,
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

    if (existingReview.status === ReviewStatus.COMPLETED) {
      throw new ConvexError({
        message: "Review already completed",
        code: 400,
      });
    }

    const sanitizedNotes = sanitizeHtml(notes || "");

    await ctx.db.patch(existingReview._id, {
      notes: sanitizedNotes,
      status: ReviewStatus.COMPLETED,
    });

    for (let i = 0; i < existingReviews.length; i++) {
      const review = existingReviews[i];

      if (review.user_id === user._id) {
        existingReviews[i] = {
          ...review,
          status: ReviewStatus.COMPLETED,
        };
      }
    }

    const allReviewsCompleted = existingReviews.every(
      (review) => review.status === ReviewStatus.COMPLETED
    );

    if (
      allReviewsCompleted &&
      existingReviews.length >= medicalCase.max_reviewers
    ) {
      await ctx.db.patch(case_id, {
        status: ReviewStatus.COMPLETED,
      });
    }
  },
});
