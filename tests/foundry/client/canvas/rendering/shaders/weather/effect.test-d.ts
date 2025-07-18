import { expectTypeOf } from "vitest";
import { WeatherShaderEffect } from "#client/canvas/rendering/shaders/_module.mjs";

import RainShader = foundry.canvas.rendering.shaders.RainShader;

const myWSE = new WeatherShaderEffect(
  {
    opacity: 1,
    intensity: 0.8,
    resolution: [0.5, 0.5],
  },
  RainShader,
);

// not a whole lot to test here not covered by QuadMesh tests
expectTypeOf(
  myWSE.configure({
    foo: { x: 1, y: 1 },
    bar: false,
    baz: [1, 1, 1],
  }),
).toExtend<void>();
