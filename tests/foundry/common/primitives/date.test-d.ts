import { describe, expectTypeOf, test } from "vitest";

declare const date: Date;

describe("Date Tests", () => {
  test("Extensions", () => {
    expectTypeOf(date.isValid()).toEqualTypeOf<boolean>();
    expectTypeOf(date.toDateInputString()).toEqualTypeOf<string>();
    expectTypeOf(date.toTimeInputString()).toEqualTypeOf<string>();
  });
});
