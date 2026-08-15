import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CategoryBrowser = foundry.applications.api.CategoryBrowser;
import ToursManagement = foundry.applications.sidebar.apps.ToursManagement;

declare const toursManagement: ToursManagement;

expectTypeOf(toursManagement).toExtend<ApplicationV2.Any>();
expectTypeOf(toursManagement).toExtend<CategoryBrowser.Any>();

// Synchronous at runtime; declared at the base's widened type so an async override still fits.
expectTypeOf(toursManagement["_prepareCategoryData"]()).toEqualTypeOf<
  MaybePromise<Record<string, CategoryBrowser.CategoryData<ToursManagement.Entry>>>
>();

declare const categoryA: CategoryBrowser.CategoryData<ToursManagement.Entry>;
declare const categoryB: CategoryBrowser.CategoryData<ToursManagement.Entry>;
expectTypeOf(toursManagement["_sortCategories"](categoryA, categoryB)).toBeNumber();

expectTypeOf<ToursManagement.Entry["id"]>().toBeString();
expectTypeOf<ToursManagement.Entry["label"]>().toBeString();
expectTypeOf<ToursManagement.Entry["completed"]>().toBeBoolean();
expectTypeOf<ToursManagement.Entry["hint"]>().toBeString();
expectTypeOf<ToursManagement.Entry["status"]>().toBeString();

// Only the members the status branch happens to reach are optional.
expectTypeOf<ToursManagement.Entry["canPlay"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<ToursManagement.Entry["canReset"]>().toEqualTypeOf<boolean | undefined>();
expectTypeOf<ToursManagement.Entry["startOrResume"]>().toEqualTypeOf<string | undefined>();

// A minimal entry — an unstarted tour never gets `canReset`.
const unstarted: ToursManagement.Entry = {
  id: "core.welcome",
  label: "Welcome",
  completed: false,
  hint: "",
  status: "Not Started",
  canPlay: true,
  startOrResume: "Start",
};
expectTypeOf(unstarted).toEqualTypeOf<ToursManagement.Entry>();
