import { expectTypeOf, test } from "vitest";

import RainShader = foundry.canvas.rendering.shaders.RainShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/weather/rain", () => {
  const RS = RainShader;
  let myRS;

  expectTypeOf((myRS = RS.create())).toEqualTypeOf<RainShader>();

  expectTypeOf(myRS.speed).toEqualTypeOf<number>();
  expectTypeOf(myRS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

  // dynamic properties from `RainShader.DefaultUniforms`
  expectTypeOf(myRS.opacity).toBeNumber();
  expectTypeOf(myRS.intensity).toBeNumber();
  expectTypeOf(myRS.strength).toBeNumber();
  expectTypeOf(myRS.rotation).toBeNumber();
  expectTypeOf(myRS.resolution).toEqualTypeOf<[number, number]>();
});
