import { expectTypeOf } from "vitest";

const myWorld = new foundry.packages.BaseWorld({
  changelog: "Test",
});

expectTypeOf(myWorld.version).toEqualTypeOf<string | null>();
