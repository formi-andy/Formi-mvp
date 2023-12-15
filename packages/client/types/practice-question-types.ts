import { api } from "../convex/_generated/api";

export type PracticeQuestion =
  (typeof api.practice_question.getPracticeQuestion)["_returnType"];

export type PracticeQuestionWithTags =
  (typeof api.practice_question.getPracticeQuestionByQuestion)["_returnType"];
