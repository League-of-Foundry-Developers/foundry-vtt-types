import { expectTypeOf } from "vitest";

import AmplificationSamplerShader = foundry.canvas.rendering.shaders.AmplificationSamplerShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const myASS = AmplificationSamplerShader.create();
expectTypeOf(myASS).toEqualTypeOf<AmplificationSamplerShader>();

expectTypeOf(AmplificationSamplerShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(AmplificationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(AmplificationSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(AmplificationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf(myASS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myASS.colorTint).toEqualTypeOf<Color.RGBColorVector>();
