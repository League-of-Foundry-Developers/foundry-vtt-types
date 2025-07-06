import { expectTypeOf } from "vitest";

import SmoothNoise = foundry.canvas.animation.SmoothNoise;

new SmoothNoise();
new SmoothNoise({
  amplitude: undefined,
  maxReferences: undefined,
  scale: undefined,
});
const mySN = new SmoothNoise({
  amplitude: 0.2, // must be finite
  scale: 1, // must be positive and finite
  maxReferences: 16, // must be power of 2
});

expectTypeOf(mySN["_maxReferences"]).toBeNumber();
expectTypeOf(mySN["_references"]).toEqualTypeOf<number[]>();

expectTypeOf(mySN.amplitude).toBeNumber();
mySN.amplitude = 0.6; // Setter
expectTypeOf(mySN["_amplitude"]).toBeNumber();

expectTypeOf(mySN.scale).toBeNumber();
mySN.scale = 2; // Setter
expectTypeOf(mySN["_scale"]).toBeNumber();

expectTypeOf(mySN.generate(4)).toBeNumber();
