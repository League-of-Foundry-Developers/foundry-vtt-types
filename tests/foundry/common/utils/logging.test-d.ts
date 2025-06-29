import { expectTypeOf } from "vitest";

expectTypeOf(foundry.utils.logCompatibilityWarning("hi there")).toBeVoid();
expectTypeOf(foundry.utils.logCompatibilityWarning("hi there", {})).toBeVoid();
expectTypeOf(
  foundry.utils.logCompatibilityWarning("hi there", {
    mode: CONST.COMPATIBILITY_MODES.FAILURE,
    details: "really biffed it",
    once: true,
    since: 42,
    until: 373,
    stack: false,
  }),
).toBeVoid();
expectTypeOf(
  foundry.utils.logCompatibilityWarning("hi there", {
    mode: undefined,
    details: undefined,
    once: undefined,
    since: undefined,
    until: undefined,
    stack: undefined,
  }),
).toBeVoid();
