import { expectTypeOf } from "vitest";

import ClientIssues = foundry.helpers.ClientIssues;

const issues = new ClientIssues();
declare const actor: Actor.Implementation;
declare const scene: Scene.Implementation;

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

// The context is correlated with the Document name: `Item` is parented by an `Actor`, never a `Scene`.
// @ts-expect-error `Scene` is not a possible parent of an `Item`
issues["_onDeleteInvalid"]("Item", ["XXXXXSomeIDXXXXX"], { parent: scene });

// `Setting` can neither live in a compendium nor be embedded in a Document that can.
// @ts-expect-error `Setting` documents are never in a compendium pack
issues["_onDeleteInvalid"]("Setting", ["XXXXXSomeIDXXXXX"], { pack: "some.pack" });
expectTypeOf(issues["_onDeleteInvalid"]("Setting", ["XXXXXSomeIDXXXXX"], { parent: null, pack: null })).toBeVoid();
