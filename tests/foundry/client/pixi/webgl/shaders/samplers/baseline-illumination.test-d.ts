import { expectTypeOf } from "vitest";

const BISS = BaselineIlluminationSamplerShader;
let myBISS;

expectTypeOf(BISS.pausable).toEqualTypeOf<boolean>();
expectTypeOf(BISS.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(BISS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BISS.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf((myBISS = BISS.create())).toEqualTypeOf<BaselineIlluminationSamplerShader>();

expectTypeOf(myBISS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myBISS.pluginName).toEqualTypeOf<string | null>();
