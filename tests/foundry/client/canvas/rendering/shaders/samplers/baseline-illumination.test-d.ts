import { expectTypeOf } from "vitest";

import BaselineIlluminationSamplerShader = foundry.canvas.rendering.shaders.BaselineIlluminationSamplerShader;

const myBISS = BaselineIlluminationSamplerShader.create();
expectTypeOf(myBISS).toEqualTypeOf<BaselineIlluminationSamplerShader>();

expectTypeOf(BaselineIlluminationSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(BaselineIlluminationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(BaselineIlluminationSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BaselineIlluminationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();

expectTypeOf(myBISS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myBISS.pluginName).toEqualTypeOf<string | null>();
