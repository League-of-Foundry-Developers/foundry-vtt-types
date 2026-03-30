import { expectTypeOf } from "vitest";

import FogSamplerShader = foundry.canvas.rendering.shaders.FogSamplerShader;

let myFSS;

expectTypeOf(FogSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(FogSamplerShader.fragmentShader).toEqualTypeOf<string>();

expectTypeOf((myFSS = FogSamplerShader.create())).toEqualTypeOf<FogSamplerShader>();

expectTypeOf(myFSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myFSS.pluginName).toEqualTypeOf<string | null>();
