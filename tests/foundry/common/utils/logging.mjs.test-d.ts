import { expectTypeOf } from "vitest";

expectTypeOf(foundry.utils.logCompatibilityWarning).parameter(0).toEqualTypeOf<string>();
expectTypeOf(foundry.utils.logCompatibilityWarning)
  .parameter(1)
  .toEqualTypeOf<foundry.utils.LogCompatibilityWarningOptions | undefined>();
expectTypeOf(foundry.utils.logCompatibilityWarning).returns.toEqualTypeOf<void>();
