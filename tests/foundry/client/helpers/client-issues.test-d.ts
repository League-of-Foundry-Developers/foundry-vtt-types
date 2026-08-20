import { expectTypeOf } from "vitest";

import ClientIssues = foundry.helpers.ClientIssues;

const issues = new ClientIssues();
declare const actor: Actor.Implementation;

expectTypeOf(issues["_detectWebGLIssues"]()).toBeVoid();

expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" })).toBeVoid();
expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, {})).toBeVoid();
expectTypeOf(issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, { decrement: true })).toBeVoid();
expectTypeOf(
  issues["_countDocumentSubType"](Actor.implementation, { source: "data" }, { decrement: undefined }),
).toBeVoid();

expectTypeOf(issues["_detectUsabilityIssues"]()).toBeVoid();

expectTypeOf(issues.getSubTypeCountsFor("find-the-culprit")).toEqualTypeOf<
  ClientIssues.ModuleSubTypeCounts | undefined
>();

for (const [key, value] of issues.getAllSubTypeCounts()) {
  expectTypeOf(key).toBeString();
  expectTypeOf(value).toEqualTypeOf<ClientIssues.ModuleSubTypeCounts>();
}

expectTypeOf(issues.validationFailures).toEqualTypeOf<ClientIssues.TrackedValidationFailures>();
expectTypeOf(issues.usabilityIssues).toEqualTypeOf<Record<string, ClientIssues.UsabilityIssue>>();
expectTypeOf(issues.packageCompatibilityIssues).toEqualTypeOf<Record<string, foundry.Game.PackageWarning>>();

expectTypeOf(issues["_detectDocumentIssues"]()).toBeVoid();

expectTypeOf(issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"])).toBeVoid();
expectTypeOf(issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"], {})).toBeVoid();
expectTypeOf(issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"], { parent: actor, pack: null })).toBeVoid();
expectTypeOf(issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"], { parent: null, pack: "some.pack" })).toBeVoid();
expectTypeOf(
  issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"], { parent: undefined, pack: undefined }),
).toBeVoid();
