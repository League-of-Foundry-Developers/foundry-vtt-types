import { expectTypeOf } from "vitest";
import { BaselineIlluminationSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myBISS = BaselineIlluminationSamplerShader.create();
expectTypeOf(myBISS).toEqualTypeOf<BaselineIlluminationSamplerShader>();

expectTypeOf(BaselineIlluminationSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(BaselineIlluminationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(BaselineIlluminationSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BaselineIlluminationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();

expectTypeOf(myBISS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myBISS.pluginName).toEqualTypeOf<string | null>();
