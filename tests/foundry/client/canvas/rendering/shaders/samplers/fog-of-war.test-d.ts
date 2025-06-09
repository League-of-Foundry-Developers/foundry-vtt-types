import { expectTypeOf } from "vitest";
import { FogSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

let myFSS;

expectTypeOf(FogSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(FogSamplerShader.fragmentShader).toEqualTypeOf<string>();

expectTypeOf((myFSS = FogSamplerShader.create())).toEqualTypeOf<FogSamplerShader>();

expectTypeOf(myFSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myFSS.pluginName).toEqualTypeOf<string | null>();
