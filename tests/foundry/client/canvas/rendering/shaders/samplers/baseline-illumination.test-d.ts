import { expectTypeOf, test } from "vitest";

import BaselineIlluminationSamplerShader = foundry.canvas.rendering.shaders.BaselineIlluminationSamplerShader;

test("foundry/client/canvas/rendering/shaders/samplers/baseline-illumination", () => {
  const myBISS = BaselineIlluminationSamplerShader.create();
  expectTypeOf(myBISS).toEqualTypeOf<BaselineIlluminationSamplerShader>();

  expectTypeOf(BaselineIlluminationSamplerShader.pausable).toEqualTypeOf<boolean>();
  expectTypeOf(BaselineIlluminationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
  expectTypeOf(BaselineIlluminationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();

  expectTypeOf(myBISS.paused).toEqualTypeOf<boolean>;
  expectTypeOf(myBISS.pluginName).toEqualTypeOf<string | null>();
});
