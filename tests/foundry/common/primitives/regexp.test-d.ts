import { describe, expectTypeOf, test } from "vitest";

describe("RegExp Tests", () => {
  test("The One Method", () => {
    expectTypeOf(RegExp.escape("Hello! (world)?")).toEqualTypeOf<string>();
  });
});
