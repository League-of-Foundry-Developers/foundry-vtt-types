import { expectTypeOf } from "vitest";

const FSS = FogSamplerShader;
let myFSS;

expectTypeOf(FSS.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(FSS.fragmentShader).toEqualTypeOf<string>();

expectTypeOf((myFSS = FSS.create())).toEqualTypeOf<FogSamplerShader>();

expectTypeOf(myFSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myFSS.pluginName).toEqualTypeOf<string | null>();
