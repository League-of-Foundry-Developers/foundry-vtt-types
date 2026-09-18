import { expectTypeOf, test } from "vitest";

import FogSamplerShader = foundry.canvas.rendering.shaders.FogSamplerShader;

test("foundry/client/canvas/rendering/shaders/samplers/fog-of-war", () => {
  let myFSS;

  expectTypeOf(FogSamplerShader.classPluginName).toEqualTypeOf<string | null>();

  expectTypeOf((myFSS = FogSamplerShader.create())).toEqualTypeOf<FogSamplerShader>();

  expectTypeOf(myFSS.paused).toEqualTypeOf<boolean>;
  expectTypeOf(myFSS.pluginName).toEqualTypeOf<string | null>();
});
