import { expectTypeOf } from "vitest";

import DataModelValidationError = foundry.data.validation.DataModelValidationError;
import ClientIssues = foundry.helpers.ClientIssues;

const issues = new ClientIssues();
declare const error: DataModelValidationError;
declare const actors: foundry.documents.collections.Actors;

expectTypeOf(issues["_detectWebGLIssues"]()).toBeVoid();

expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" })).toBeVoid();
expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, {})).toBeVoid();
expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, { decrement: true })).toBeVoid();
expectTypeOf(
  issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, { decrement: undefined }),
).toBeVoid();

expectTypeOf(issues["_trackValidationFailures"](actors, { source: "data" }, error));

expectTypeOf(issues["_detectUsabilityIssues"]()).toBeVoid();

expectTypeOf(issues.getSubTypeCountsFor("find-the-culprit")).toEqualTypeOf<
  ClientIssues.ModuleSubTypeCounts | undefined
>();

for (const [key, value] of issues.getAllSubtypeCounts()) {
  expectTypeOf(key).toBeString();
  expectTypeOf(value).toEqualTypeOf<ClientIssues.ModuleSubTypeCounts>();
}

expectTypeOf(issues.validationFailures).toEqualTypeOf<ClientIssues.TrackedValidationFailures>();
expectTypeOf(issues.usabilityIssues).toEqualTypeOf<Record<string, ClientIssues.UsabilityIssue>>();
expectTypeOf(issues.packageCompatibilityIssues).toEqualTypeOf<foundry.Game.Data["packageWarnings"]>();
