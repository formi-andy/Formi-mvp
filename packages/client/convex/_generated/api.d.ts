/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.8.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as action_item from "../action_item.js";
import type * as contact_us_message from "../contact_us_message.js";
import type * as history from "../history.js";
import type * as http from "../http.js";
import type * as images from "../images.js";
import type * as invite from "../invite.js";
import type * as medical_case from "../medical_case.js";
import type * as medical_student from "../medical_student.js";
import type * as migrations from "../migrations.js";
import type * as patient_doctor from "../patient_doctor.js";
import type * as practice_question from "../practice_question.js";
import type * as practice_questions_seen from "../practice_questions_seen.js";
import type * as practice_session from "../practice_session.js";
import type * as profile from "../profile.js";
import type * as review from "../review.js";
import type * as users from "../users.js";
import type * as waitlist from "../waitlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  action_item: typeof action_item;
  contact_us_message: typeof contact_us_message;
  history: typeof history;
  http: typeof http;
  images: typeof images;
  invite: typeof invite;
  medical_case: typeof medical_case;
  medical_student: typeof medical_student;
  migrations: typeof migrations;
  patient_doctor: typeof patient_doctor;
  practice_question: typeof practice_question;
  practice_questions_seen: typeof practice_questions_seen;
  practice_session: typeof practice_session;
  profile: typeof profile;
  review: typeof review;
  users: typeof users;
  waitlist: typeof waitlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
