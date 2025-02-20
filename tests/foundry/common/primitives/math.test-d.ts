import { expectTypeOf } from "vitest";

expectTypeOf(Math.SQRT3).toEqualTypeOf<1.7320508075688772>();
expectTypeOf(Math.SQRT1_3).toEqualTypeOf<0.5773502691896257>();

expectTypeOf(Math.clamp(5, 1, 3)).toEqualTypeOf<number>();
expectTypeOf(Math.clamped(5, 1, 3)).toEqualTypeOf<number>();

expectTypeOf(Math.mix(5, 10, 0.5)).toEqualTypeOf<number>();

expectTypeOf(Math.normalizeDegrees(240, 360)).toEqualTypeOf<number>();
expectTypeOf(Math.normalizeDegrees(240)).toEqualTypeOf<number>();

expectTypeOf(Math.normalizeRadians(4.18879)).toEqualTypeOf<number>();

expectTypeOf(Math.roundDecimals(4.18879, 2)).toEqualTypeOf<number>();

expectTypeOf(Math.toDegrees(4.18879)).toEqualTypeOf<number>();

expectTypeOf(Math.toRadians(240)).toEqualTypeOf<number>();

expectTypeOf(Math.oscillation(0.5, 2.0, 126387.8)).toEqualTypeOf<number>();
expectTypeOf(Math.oscillation(0.5, 2.0, 126387.8, 2000)).toEqualTypeOf<number>();
expectTypeOf(Math.oscillation(0.5, 2.0, 126387.8, 2000, Math.sin)).toEqualTypeOf<number>();
