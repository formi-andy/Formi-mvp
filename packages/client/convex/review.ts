import { ConvexError, v } from "convex/values";
import { QueryCtx, internalQuery, query, mutation } from "./_generated/server";
import { mustGetCurrentUser, mustGetUserById } from "./users";
import { Id } from "./_generated/dataModel";
import { mustGetMedicalStudentbyId } from "./medical_student";
import { getMedicalCase } from "./medical_case";

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
