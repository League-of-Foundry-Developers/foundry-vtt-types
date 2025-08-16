import { describe, expectTypeOf, test } from "vitest";

declare const num: number;
declare const roundingMethod: "round" | "ceil" | "floor";

describe("Number Tests", () => {
  test("Instance methods", () => {
    expectTypeOf(num.almostEqual(3)).toEqualTypeOf<boolean>();
    expectTypeOf(num.almostEqual(3, 1e-6)).toEqualTypeOf<boolean>();

    expectTypeOf(num.ordinalString()).toEqualTypeOf<string>();

    expectTypeOf(num.paddedString(3)).toEqualTypeOf<string>();

    expectTypeOf(num.signedString()).toBeString();

    expectTypeOf(num.toNearest()).toEqualTypeOf<number>();
    expectTypeOf(num.toNearest(2)).toEqualTypeOf<number>();
    expectTypeOf(num.toNearest(2, roundingMethod)).toEqualTypeOf<number>();
    expectTypeOf(num.toNearest(2, roundingMethod, 0.25)).toEqualTypeOf<number>();

    expectTypeOf(num.between(3, 5)).toEqualTypeOf<boolean>();
    expectTypeOf(num.between(3, 5, false)).toEqualTypeOf<boolean>();
  });

  test("Static methods", () => {
    expectTypeOf(Number.between(num, 3, 5)).toBeBoolean();
    expectTypeOf(Number.between(num, 3, 5, false)).toBeBoolean();

    expectTypeOf(Number.isNumeric({})).toBeBoolean();
    expectTypeOf(Number.isNumeric(false)).toBeBoolean();
    expectTypeOf(Number.isNumeric(7)).toBeBoolean();

    // it does actually `return Number(n)`
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    expectTypeOf(Number.fromString(7)).toEqualTypeOf<Number>();
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    expectTypeOf(Number.fromString("42")).toEqualTypeOf<Number>();
  });
});
