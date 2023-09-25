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
import type * as action_items from "../action_items";
import type * as http from "../http";
import type * as images from "../images";
import type * as invite from "../invite";
import type * as migrations from "../migrations";
import type * as patient_doctors from "../patient_doctors";
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
  action_items: typeof action_items;
  http: typeof http;
  images: typeof images;
  invite: typeof invite;
  migrations: typeof migrations;
  patient_doctors: typeof patient_doctors;
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
