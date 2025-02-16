import { expectTypeOf } from "vitest";

declare const num: number;

expectTypeOf(num.almostEqual(3)).toEqualTypeOf<boolean>();
expectTypeOf(num.ordinalString()).toEqualTypeOf<string>();
expectTypeOf(num.paddedString(3)).toEqualTypeOf<string>();
expectTypeOf(num.toNearest()).toEqualTypeOf<number>();
expectTypeOf(num.between(3, 5)).toEqualTypeOf<boolean>();
