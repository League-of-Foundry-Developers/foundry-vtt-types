import { expectTypeOf } from "vitest";

const mySystem = new foundry.packages.BaseModule({
  changelog: "Test",
});

expectTypeOf(mySystem.library).toEqualTypeOf<boolean>();
