import { expectTypeOf, test } from "vitest";

import SnowShader = foundry.canvas.rendering.shaders.SnowShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/weather/snow", () => {
  const SS = SnowShader;
  let mySS;

  expectTypeOf((mySS = SS.create())).toEqualTypeOf<SnowShader>();

  expectTypeOf(mySS.speed).toEqualTypeOf<number>();
  expectTypeOf(mySS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

  // dynamic properties from `SnowShader.DefaultOptions`
  expectTypeOf(mySS.direction).toBeNumber();
});
