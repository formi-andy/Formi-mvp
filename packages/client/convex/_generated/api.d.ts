/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.3.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as action_item from "../action_item";
import type * as contact_us_message from "../contact_us_message";
import type * as history from "../history";
import type * as http from "../http";
import type * as images from "../images";
import type * as invite from "../invite";
import type * as medical_case from "../medical_case";
import type * as medical_student from "../medical_student";
import type * as migrations from "../migrations";
import type * as patient_doctor from "../patient_doctor";
import type * as profile from "../profile";
import type * as review from "../review";
import type * as users from "../users";
import type * as waitlist from "../waitlist";

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
