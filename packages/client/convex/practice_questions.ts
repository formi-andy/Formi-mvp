import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

export const createPracticeQuestion = internalMutation({
  args: {
    question: v.string(),
    choices: v.array(v.string()),
    answer: v.number(),
    explanation: v.array(v.string()),
    summary: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (
    ctx,
    { question, choices, answer, explanation, summary, tags }
  ) => {
    // check if question already exists
    const existingQuestion = await ctx.db
      .query("practice_questions")
      .withIndex("by_question", (q) => q.eq("question", question))
      .first();

    if (existingQuestion) {
      throw new ConvexError({
        message: "Question already exists",
        code: 400,
      });
    }

    const practiceQuestion = await ctx.db.insert("practice_questions", {
      question,
      choices,
      answer,
      explanation,
      summary,
    });

    // add tags
    await Promise.all(
      tags.map(async (tag) => {
        await ctx.db.insert("practice_question_tags", {
          practice_question_id: practiceQuestion,
          tag,
        });
      })
    );

    return practiceQuestion;
  },
});

export const getPracticeQuestion = query({
  args: { practiceQuestionId: v.id("practice_questions") },
  async handler(ctx, args) {
    return ctx.db.get(args.practiceQuestionId);
  },
});

export async function mustGetPracticeQuestion(
  ctx: QueryCtx,
  practiceQuestionId: Id<"practice_questions">
) {
  const practiceQuestion = await getPracticeQuestion(ctx, {
    practiceQuestionId,
  });
  if (!practiceQuestion)
    throw new ConvexError({
      message: "Practice question not found",
      code: 404,
    });

  return practiceQuestion;
}

export const deletePracticeQuestionById = internalMutation({
  args: { practiceQuestionId: v.id("practice_questions") },
  handler: async (ctx, { practiceQuestionId }) => {
    const practiceQuestion = await mustGetPracticeQuestion(
      ctx,
      practiceQuestionId
    );
    await ctx.db.delete(practiceQuestion._id);
  },
});

export const updatePracticeQuestion = internalMutation({
  args: {
    practiceQuestionId: v.id("practice_questions"),
    question: v.optional(v.string()),
    choices: v.optional(v.array(v.string())),
    answer: v.optional(v.number()),
    explanation: v.optional(v.array(v.string())),
    summary: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    {
      practiceQuestionId,
      question,
      choices,
      answer,
      explanation,
      summary,
      tags,
    }
  ) => {
    const practiceQuestion = await mustGetPracticeQuestion(
      ctx,
      practiceQuestionId
    );

    await ctx.db.patch(practiceQuestion._id, {
      question,
      choices,
      answer,
      explanation,
      summary,
    });

    // get existing tags
    const existingTags = new Set(
      await ctx.db
        .query("practice_question_tags")
        .withIndex("by_practice_question_id", (q) =>
          q.eq("practice_question_id", practiceQuestionId)
        )
        .collect()
    );

    // find new tags, delete tags, and existing tags
    const submittedTagsSet = new Set(tags);
    // Extracting tag strings from existingTags objects
    const existingTagStrings = new Set(
      Array.from(new Set(existingTags)).map((obj) => obj.tag)
    );

    // Find new tags to add (in submittedTagsSet but not in existingTagStrings)
    const tagsToAdd = new Set(
      Array.from(new Set(submittedTagsSet)).filter(
        (tag) => !existingTagStrings.has(tag)
      )
    );

    // Find tags to delete (in existingTagStrings but not in submittedTagsSet)
    const tagsToDelete = new Set(
      Array.from(new Set(existingTags))
        .filter((tagObj) => !submittedTagsSet.has(tagObj.tag))
        .map((tagObj) => tagObj._id)
    );

    // Delete tags
    await Promise.all(
      Array.from(new Set(tagsToDelete)).map(async (tag) => {
        await ctx.db.delete(tag);
      })
    );

    // Add new tags
    await Promise.all(
      Array.from(new Set(tagsToAdd)).map(async (tag) => {
        await ctx.db.insert("practice_question_tags", {
          practice_question_id: practiceQuestionId,
          tag,
        });
      })
    );
  },
});
