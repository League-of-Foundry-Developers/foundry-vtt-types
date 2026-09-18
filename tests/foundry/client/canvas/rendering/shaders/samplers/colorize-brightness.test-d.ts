import { expectTypeOf, test } from "vitest";

import ColorizeBrightnessShader = foundry.canvas.rendering.shaders.ColorizeBrightnessShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/shaders/samplers/colorize-brightness", () => {
  const _myCBS = ColorizeBrightnessShader.create();

  expectTypeOf(ColorizeBrightnessShader.classPluginName).toEqualTypeOf<string | null>();
  expectTypeOf(ColorizeBrightnessShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
});
