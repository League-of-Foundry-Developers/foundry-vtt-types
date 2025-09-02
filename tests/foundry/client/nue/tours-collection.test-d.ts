import { describe, expectTypeOf, test } from "vitest";

import ToursCollection = foundry.nue.ToursCollection;
import Tour = foundry.nue.Tour;

declare const tour: Tour;

describe("ToursCollection Tests", () => {
  test("Construction", () => {
    new ToursCollection();
  });

  const tours = new ToursCollection();

  test("Registration", () => {
    expectTypeOf(tours.register("core", "welcome", tour)).toEqualTypeOf<void>();
    expectTypeOf(tours.set("core.welcome", tour)).toEqualTypeOf<typeof tours>();
  });
});
