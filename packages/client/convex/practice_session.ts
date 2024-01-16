import { ConvexError, v } from "convex/values";
import { UserRole } from "../types/role-types";
import { SessionStatus } from "../types/practice-session-types";
import { QueryCtx, internalQuery, mutation, query } from "./_generated/server";

import { mustGetCurrentUser } from "./users";
import { Doc, Id } from "./_generated/dataModel";

export const getSessions = query({
  args: {},
  async handler(ctx) {
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Only medical students can access practice sessions",
        code: 403,
      });
    }

    const sessions = await ctx.db
      .query("practice_session")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();

    return sessions;
  },
});

export const getSession = query({
  args: {
    session_id: v.id("practice_session"),
  },
  async handler(ctx, args) {
    const { session_id } = args;
    const session = await checkSession(ctx, session_id);

    return session;
  },
});

export const getSessionQuestions = internalQuery({
  args: {
    session_id: v.id("practice_session"),
  },
  async handler(ctx, args) {
    const { session_id } = args;
    const session = await checkSession(ctx, session_id);

    const questions = session.questions.map((question) => question.id);

    const fullQuestions = await Promise.all(
      questions.map((id) => ctx.db.get(id))
    );

    const parsedQuestions = fullQuestions.map((question) => {
      if (!question) {
        throw new ConvexError({
          message: "Question not found",
          code: 404,
        });
      }

      return question;
    });

    return parsedQuestions;
  },
});

export const getStrippedSessionQuestions = query({
  args: {
    session_id: v.id("practice_session"),
  },
  async handler(ctx, args) {
    const { session_id } = args;
    const session = await checkSession(ctx, session_id);

    const strippedQuestions = await Promise.all(
      session.questions.map(async (sessionQuestion) => {
        const question = await ctx.db.get(sessionQuestion.id);

        if (!question) {
          throw new ConvexError({
            message: "Question not found",
            code: 404,
          });
        }

        return {
          ...sessionQuestion,
          questionImages: question.question_images,
        };
      })
    );

    return strippedQuestions;
  },
});

export const getQuestions = query({
  args: {
    session_id: v.id("practice_session"),
  },
  async handler(ctx, args) {
    const { session_id } = args;
    const session = await checkSession(ctx, session_id);

    const questions = await Promise.all(
      session.questions.map(async (sessionQuestion) => {
        const question = await ctx.db.get(sessionQuestion.id);

        if (!question) {
          throw new ConvexError({
            message: "Question not found",
            code: 404,
          });
        }

        return {
          ...sessionQuestion,
          explanation: question.explanation,
          answer: question.answer,
          explanationImages: question.explanation_images,
          questionImages: question.question_images,
        };
      })
    );

    return questions;
  },
});

export const createSession = mutation({
  args: {
    name: v.optional(v.string()),
    total_questions: v.number(),
    tags: v.array(v.string()),
    zen: v.boolean(),
  },
  async handler(ctx, args) {
    const { total_questions, name, tags, zen } = args;
    const user = await mustGetCurrentUser(ctx);

    if (user.role !== UserRole.MedicalStudent) {
      throw new ConvexError({
        message: "Only medical students can create practice sessions",
        code: 403,
      });
    }

    let uniqueIds: Set<Id<"practice_question">>;

    if (tags.length > 0) {
      const matchingQuestions = (
        await Promise.all(
          tags.map(async (tag) => {
            return ctx.db
              .query("practice_question_tag")
              .withIndex("by_tag", (q) => q.eq("tag", tag))
              .collect();
          })
        )
      ).flat();

      uniqueIds = new Set(
        matchingQuestions.map((obj) => obj.practice_question_id)
      );
    } else {
      const practiceQuestions = await ctx.db
        .query("practice_question")
        .collect();

      uniqueIds = new Set(practiceQuestions.map((obj) => obj._id));
    }

    const uniquePracticeQuestions = Array.from(uniqueIds);

    uniquePracticeQuestions.sort(() => Math.random() - 0.5);

    if (uniquePracticeQuestions.length >= total_questions) {
      uniquePracticeQuestions.splice(total_questions);
    }

    const fullQuestions = await Promise.all(
      uniquePracticeQuestions.map(async (id) => {
        const question = await ctx.db.get(id);

        if (!question) {
          throw new ConvexError({
            message: "Question not found",
            code: 404,
          });
        }

        const randomizedChoices = question.choices.sort(
          () => Math.random() - 0.5
        );

        return {
          id: question._id,
          question: question.question,
          choices: randomizedChoices,
        };
      })
    );

    return ctx.db.insert("practice_session", {
      name,
      user_id: user._id,
      total_time: 0,
      total_correct: 0,
      questions: fullQuestions.map(({ id, question, choices }) => ({
        id,
        question,
        choices,
        time: 0,
      })),
      tags: tags || [],
      status: SessionStatus.Created,
      updated_at: Date.now(),
      zen,
    });
  },
});

export const pauseSession = mutation({
  args: {
    session_id: v.id("practice_session"),
    pause: v.boolean(),
  },
  async handler(ctx, args) {
    const { session_id, pause } = args;
    const currentTime = Date.now();

    const session = await checkSession(ctx, session_id);

    if (
      (session.status === SessionStatus.Paused && pause) ||
      (session.status === SessionStatus.Created && !pause)
    ) {
      return;
    }

    if (session.status === SessionStatus.Completed) {
      throw new ConvexError({
        message: "Session finished",
        code: 401,
      });
    }

    if (pause) {
      const timeElapsed = currentTime - session.updated_at;

      return ctx.db.patch(session_id, {
        status: SessionStatus.Paused,
        updated_at: Date.now(),
        total_time: session.total_time + timeElapsed,
      });
    }

    return ctx.db.patch(session_id, {
      status: SessionStatus.Created,
      updated_at: Date.now(),
    });
  },
});

export const saveAnswer = mutation({
  args: {
    session_id: v.id("practice_session"),
    question: v.object({
      id: v.id("practice_question"),
      response: v.optional(v.string()),
      time: v.number(),
    }),
  },
  async handler(ctx, args) {
    const { session_id, question } = args;
    const currentTime = Date.now();
    const session = await checkSession(ctx, session_id);
    const timeElapsed = currentTime - session.updated_at;

    if (session.status === SessionStatus.Completed) {
      throw new ConvexError({
        message: "Session already completed",
        code: 401,
      });
    }

    let updatedQuestions = [...session.questions];

    const questionIndex = updatedQuestions.findIndex(
      (q) => q.id === question.id
    );

    if (questionIndex === -1) {
      throw new ConvexError({
        message: "Question not found",
        code: 404,
      });
    }

    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      response: question.response,
      time: question.time,
    };

    return ctx.db.patch(session_id, {
      questions: updatedQuestions,
      updated_at: currentTime,
      total_time: session.total_time + timeElapsed,
    });
  },
});

export const gradeSession = mutation({
  args: {
    session_id: v.id("practice_session"),
    last_question: v.object({
      id: v.id("practice_question"),
      response: v.optional(v.string()),
      time: v.number(),
    }),
  },
  async handler(ctx, args) {
    const { session_id, last_question } = args;
    const currentTime = Date.now();
    const session = await checkSession(ctx, session_id);
    const timeElapsed = currentTime - session.updated_at;

    if (session.status === SessionStatus.Completed) {
      throw new ConvexError({
        message: "Session already completed",
        code: 401,
      });
    }

    let updatedQuestions = [...session.questions];

    const lastQuestionIndex = updatedQuestions.findIndex(
      (q) => q.id === last_question.id
    );

    if (lastQuestionIndex === -1) {
      throw new ConvexError({
        message: "Question not found",
        code: 404,
      });
    }

    updatedQuestions[lastQuestionIndex] = {
      ...updatedQuestions[lastQuestionIndex],
      response: last_question.response,
      time: last_question.time,
    };

    const fullQuestions = await getSessionQuestions(ctx, { session_id });

    for (let i = 0; i < session.questions.length; i++) {
      if (updatedQuestions[i].id !== session.questions[i].id) {
        throw new ConvexError({
          message: "Questions don't align",
          code: 401,
        });
      }

      if (!fullQuestions[i]) {
        throw new ConvexError({
          message: "Server Error",
          code: 500,
        });
      }

      updatedQuestions[i] = {
        ...updatedQuestions[i],
        correct: updatedQuestions[i].response === fullQuestions[i]?.answer,
      };
    }

    return ctx.db.patch(session_id, {
      questions: updatedQuestions,
      updated_at: currentTime,
      total_time: session.total_time + timeElapsed,
      status: SessionStatus.Completed,
    });
  },
});

export async function checkSession(
  ctx: QueryCtx,
  session_id: Id<"practice_session">
): Promise<Doc<"practice_session">> {
  const [user, session] = await Promise.all([
    mustGetCurrentUser(ctx),
    ctx.db.get(session_id),
  ]);

  if (!session) {
    throw new ConvexError({
      message: "Session not found",
      code: 404,
    });
  }

  if (session.user_id !== user._id) {
    throw new ConvexError({
      message: "You are not authorized to access this session",
      code: 403,
    });
  }

  return session;
}
