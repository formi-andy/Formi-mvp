import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mustGetCurrentUser } from "./users";
import { EmailAddressJSON } from "@clerk/clerk-sdk-node";
import { api } from "./_generated/api";
import { UserRole } from "../types/role-types";

export const createPracticeQuestion = mutation({
  args: {
    question: v.string(),
    choices: v.array(v.string()),
    answer: v.string(),
    explanation: v.array(v.string()),
    summary: v.string(),
    questionImages: v.optional(v.array(v.string())),
    answerImages: v.optional(v.array(v.string())),
    tags: v.array(v.string()),
  },
  handler: async (
    ctx,
    {
      question,
      choices,
      answer,
      explanation,
      summary,
      questionImages,
      answerImages,
      tags,
    }
  ) => {
    const user = await mustGetCurrentUser(ctx);
    const formiEmail = user.clerkUser.email_addresses.find(
      (emailAddress: EmailAddressJSON) =>
        emailAddress.email_address.endsWith("formi.health")
    );

    if (!formiEmail) {
      throw new ConvexError({
        message: "Unauthorized",
        code: 401,
      });
    }

    // check if question already exists
    const existingQuestion = await ctx.db
      .query("practice_question")
      .withIndex("by_question", (q) => q.eq("question", question))
      .first();

    if (existingQuestion) {
      throw new ConvexError({
        message: "Question already exists",
        code: 409,
      });
    }

    const practiceQuestion = await ctx.db.insert("practice_question", {
      question,
      choices,
      answer,
      explanation,
      summary,
      question_images: questionImages ?? [],
      answerImages,
    });

    // add tags
    await Promise.all(
      tags.map(async (tag) => {
        await ctx.db.insert("practice_question_tag", {
          practice_question_id: practiceQuestion,
          tag,
        });
      })
    );

    return practiceQuestion;
  },
});

export const getPracticeQuestion = query({
  args: { practiceQuestionId: v.id("practice_question") },
  async handler(ctx, args) {
    return ctx.db.get(args.practiceQuestionId);
  },
});

export const getPracticeQuestionByQuestion = query({
  args: { question: v.string() },
  async handler(ctx, args) {
    const question = await ctx.db
      .query("practice_question")
      .withIndex("by_question", (q) => q.eq("question", args.question))
      .first();

    if (!question) {
      throw new ConvexError({
        message: "Question not found",
        code: 404,
      });
    }

    // get tags for question
    const tags = await ctx.db
      .query("practice_question_tag")
      .withIndex("by_practice_question_id", (q) =>
        q.eq("practice_question_id", question._id)
      )
      .collect();

    return {
      ...question,
      tags: tags.map((obj) => obj.tag),
    };
  },
});

export async function mustGetPracticeQuestion(
  ctx: QueryCtx,
  practiceQuestionId: Id<"practice_question">
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
  args: { practiceQuestionId: v.id("practice_question") },
  handler: async (ctx, { practiceQuestionId }) => {
    const practiceQuestion = await mustGetPracticeQuestion(
      ctx,
      practiceQuestionId
    );
    await ctx.db.delete(practiceQuestion._id);
  },
});

export const updatePracticeQuestion = mutation({
  args: {
    id: v.id("practice_question"),
    question: v.optional(v.string()),
    choices: v.optional(v.array(v.string())),
    answer: v.optional(v.string()),
    explanation: v.optional(v.array(v.string())),
    summary: v.optional(v.string()),
    questionImages: v.optional(v.array(v.string())),
    answerImages: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    {
      id,
      question,
      choices,
      answer,
      explanation,
      summary,
      questionImages,
      answerImages,
      tags,
    }
  ) => {
    const user = await mustGetCurrentUser(ctx);
    const formiEmail = user.clerkUser.email_addresses.find(
      (emailAddress: EmailAddressJSON) =>
        emailAddress.email_address.endsWith("formi.health")
    );

    if (!formiEmail) {
      throw new ConvexError({
        message: "Unauthorized",
        code: 401,
      });
    }

    const practiceQuestion = await mustGetPracticeQuestion(ctx, id);

    await ctx.db.patch(practiceQuestion._id, {
      question,
      choices,
      answer,
      explanation,
      summary,
      question_images: questionImages,
      answerImages,
    });

    // get existing tags
    const existingTags = new Set(
      await ctx.db
        .query("practice_question_tag")
        .withIndex("by_practice_question_id", (q) =>
          q.eq("practice_question_id", id)
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
        await ctx.db.insert("practice_question_tag", {
          practice_question_id: id,
          tag,
        });
      })
    );
  },
});

export const checkPracticeQuestionAnswer = action({
  args: {
    practiceQuestionId: v.id("practice_question"),
    answer: v.string(),
  },
  async handler(
    ctx,
    { practiceQuestionId, answer }
  ): Promise<{
    correct: boolean;
    explanation: string[];
    answer: string;
  }> {
    const practiceQuestion = await ctx.runQuery(
      api.practice_question.getPracticeQuestion,
      {
        practiceQuestionId,
      }
    );
    if (!practiceQuestion)
      throw new ConvexError({
        message: "Practice question not found",
        code: 404,
      });

    if (practiceQuestion.answer === answer) {
      return {
        correct: true,
        explanation: practiceQuestion.explanation,
        answer: practiceQuestion.answer,
      };
    } else {
      return {
        correct: false,
        explanation: practiceQuestion.explanation,
        answer: practiceQuestion.answer,
      };
    }
  },
});

export const getRandomPracticeQuestion = query({
  args: {
    hash: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seenQuestions: v.optional(v.array(v.id("practice_question"))),
  },
  async handler(ctx, args) {
    let uniqueIds: Set<Id<"practice_question">>;

    // TODO: make more efficient, right now it scans all questions
    // when tags are provided, it fires off a query for each tag (OPTIMIZE LATER)
    if (args.tags) {
      const matchingPostTags = (
        await Promise.all(
          args.tags.map(async (tag) => {
            return ctx.db
              .query("practice_question_tag")
              .withIndex("by_tag", (q) => q.eq("tag", tag))
              .collect();
          })
        )
      ).flat();

      uniqueIds = new Set(
        matchingPostTags.map((obj) => obj.practice_question_id)
      );
    } else {
      const practiceQuestions = await ctx.db
        .query("practice_question")
        .collect();

      uniqueIds = new Set(practiceQuestions.map((obj) => obj._id));
    }

    if (args.seenQuestions) {
      const seenQuestionIds = new Set(args.seenQuestions);
      uniqueIds = new Set(
        Array.from(uniqueIds).filter((id) => !seenQuestionIds.has(id))
      );
    }

    // all questions have been seen
    if (uniqueIds.size === 0) {
      return null;
    }

    const uniquePracticeQuestions = Array.from(uniqueIds);

    const randomId =
      uniquePracticeQuestions[
        Math.floor(Math.random() * uniquePracticeQuestions.length)
      ];

    const randomPracticeQuestion = await ctx.db.get(randomId);

    if (!randomPracticeQuestion)
      throw new ConvexError({
        message: "Practice question not found",
        code: 404,
      });

    const strippedPracticeQuestion = {
      _id: randomPracticeQuestion._id,
      question: randomPracticeQuestion.question,
      choices: randomPracticeQuestion.choices,
      questionImages: randomPracticeQuestion.question_images,
      answerImages: randomPracticeQuestion.answerImages,
    };

    const randomizedChoices = strippedPracticeQuestion.choices.sort(
      () => Math.random() - 0.5
    );

    return {
      ...strippedPracticeQuestion,
      choices: randomizedChoices,
    };
  },
});

export const reportPracticeQuestion = mutation({
  args: {
    practiceQuestionId: v.id("practice_question"),
    feedback: v.string(),
  },
  async handler(ctx, { practiceQuestionId, feedback }) {
    const user = await mustGetCurrentUser(ctx);
    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Unauthorized",
        code: 401,
      });
    }

    await mustGetPracticeQuestion(ctx, practiceQuestionId);

    await ctx.db.insert("practice_question_feedback", {
      practice_question_id: practiceQuestionId,
      feedback,
      user_id: user._id,
    });

    return practiceQuestionId;
  },
});
