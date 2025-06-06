import { expectTypeOf } from "vitest";
import { AbstractBaseShader, AmplificationSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myASS = AmplificationSamplerShader.create();
expectTypeOf(myASS).toEqualTypeOf<AmplificationSamplerShader>();

expectTypeOf(AmplificationSamplerShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(AmplificationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(AmplificationSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(AmplificationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf(myASS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myASS.colorTint).toEqualTypeOf<Color.RGBColorVector>();
