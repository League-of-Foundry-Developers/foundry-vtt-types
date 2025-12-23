import { describe, expectTypeOf, test } from "vitest";

import registerTours = foundry.nue.registerTours;

describe("`client/nue/_module` Tests", () => {
  test("Miscellaneous", () => {
    expectTypeOf(registerTours()).toEqualTypeOf<Promise<void>>();
  });
});
