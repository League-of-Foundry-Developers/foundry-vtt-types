import { expectTypeOf } from "vitest";
import { BaseSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myBSS = BaseSamplerShader.create();
expectTypeOf(myBSS).toEqualTypeOf<BaseSamplerShader>();

expectTypeOf(BaseSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(BaseSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(BaseSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BaseSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();
// TODO: I'd like to test `.createPlugin` but the BatchPlugin magic isn't exported

expectTypeOf(myBSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myBSS.pluginName).toEqualTypeOf<string | null>();
