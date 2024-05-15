import { expectTypeOf } from "vitest";

const mySystem = new foundry.packages.BaseModule({
  changelog: "Test",
});

expectTypeOf(mySystem.library).toEqualTypeOf<boolean>();
// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(mySystem.documentTypes).toEqualTypeOf<object>();
