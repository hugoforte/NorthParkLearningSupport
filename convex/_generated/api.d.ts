/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as classAssignments from "../classAssignments.js";
import type * as classes from "../classes.js";
import type * as goals from "../goals.js";
import type * as grades from "../grades.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as notes from "../notes.js";
import type * as students from "../students.js";
import type * as subjects from "../subjects.js";
import type * as teachers from "../teachers.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  classAssignments: typeof classAssignments;
  classes: typeof classes;
  goals: typeof goals;
  grades: typeof grades;
  http: typeof http;
  migrations: typeof migrations;
  notes: typeof notes;
  students: typeof students;
  subjects: typeof subjects;
  teachers: typeof teachers;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
