import { expectTypeOf } from "vitest";

let myBSS;

expectTypeOf(BaseSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(BaseSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(BaseSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BaseSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();
// I'd like to test `.createPlugin` but the BatchPlugin magic isn't exported
expectTypeOf((myBSS = BaseSamplerShader.create())).toEqualTypeOf<BaseSamplerShader>();

expectTypeOf(myBSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myBSS.pluginName).toEqualTypeOf<string | null>();
