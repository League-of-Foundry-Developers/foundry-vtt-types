import { expectTypeOf } from "vitest";

const mySystem = new foundry.packages.BaseSystem({
  changelog: "Test",
});

expectTypeOf(mySystem.primaryTokenAttribute).toEqualTypeOf<string | undefined>();
