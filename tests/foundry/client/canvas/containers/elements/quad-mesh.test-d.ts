import { describe, expectTypeOf, test } from "vitest";

import QuadMesh = foundry.canvas.containers.QuadMesh;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import BaseSamplerShader = foundry.canvas.rendering.shaders.BaseSamplerShader;

declare const renderer: PIXI.Renderer;

describe("QuadMesh tests", () => {
  const myQM = new QuadMesh(BaseSamplerShader);

  test("Miscellaneous", () => {
    expectTypeOf(myQM.shader).toEqualTypeOf<AbstractBaseShader>();

    expectTypeOf(myQM.blendMode).toEqualTypeOf<PIXI.BLEND_MODES>();
    myQM.blendMode = PIXI.BLEND_MODES.SOFT_LIGHT; // Setter

    expectTypeOf(myQM.setShaderClass(BaseSamplerShader)).toBeVoid();

    expectTypeOf(myQM["_render"](renderer)).toBeVoid();
    expectTypeOf(myQM["_calculateBounds"]()).toBeVoid();

    expectTypeOf(myQM.containsPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
    expectTypeOf(myQM.destroy()).toBeVoid();
  });
});
