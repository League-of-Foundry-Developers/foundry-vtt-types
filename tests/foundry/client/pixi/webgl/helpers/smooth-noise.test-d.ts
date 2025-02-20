import { expectTypeOf } from "vitest";

const mySN = new SmoothNoise({
  amplitude: 0.2,
  scale: 1,
  maxReferences: 16,
});

expectTypeOf(mySN.amplitude).toEqualTypeOf<number>();
expectTypeOf(mySN.scale).toEqualTypeOf<number>();
expectTypeOf(mySN._references).toEqualTypeOf<number[]>();
expectTypeOf(mySN.generate(4)).toEqualTypeOf<number>();
