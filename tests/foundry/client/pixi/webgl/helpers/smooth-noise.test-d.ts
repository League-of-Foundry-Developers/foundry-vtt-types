import { expectTypeOf } from "vitest";

const mySN = new SmoothNoise({
  maxReferences: 16,
  amplitude: 2,
  scale: 1,
});

expectTypeOf(mySN._amplitude).toEqualTypeOf<number>();
expectTypeOf(mySN.generate(5)).toEqualTypeOf<number>();
