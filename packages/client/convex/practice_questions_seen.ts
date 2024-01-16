import { ConvexError, v } from "convex/values";
import { UserRole } from "../types/role-types";
import { mutation, query } from "./_generated/server";

import { mustGetCurrentUser } from "./users";
import { Doc, Id } from "./_generated/dataModel";

export const getSeenQuestions = query({
  args: {
    tag: v.string(),
  },
  async handler(ctx, args) {
    const user = await mustGetCurrentUser(ctx);

    const seenQuestions = await ctx.db
      .query("practice_questions_seen")
      .withIndex("by_user_and_tag", (q) =>
        q.eq("user_id", user._id).eq("tag", args.tag)
      )
      .first();

    if (!seenQuestions) {
      return [];
    }

    return seenQuestions.questions;
  },
});

export const addSeenQuestions = mutation({
  args: {
    question_ids: v.array(v.id("practice_question")),
    tag: v.string(),
  },
  async handler(ctx, { question_ids, tag }) {
    const user = await mustGetCurrentUser(ctx);

    const seenQuestions = await ctx.db
      .query("practice_questions_seen")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .first();

    if (!seenQuestions) {
      return ctx.db.insert("practice_questions_seen", {
        user_id: user._id,
        questions: question_ids,
        tag,
      });
    }
    const questionSet = new Set(seenQuestions.questions);
    for (let i = 0; i < question_ids.length; i++) {
      questionSet.add(question_ids[i]);
    }

    const newQuestionIds = Array.from(questionSet);
    return ctx.db.patch(seenQuestions._id, {
      questions: newQuestionIds,
    });
  },
});
