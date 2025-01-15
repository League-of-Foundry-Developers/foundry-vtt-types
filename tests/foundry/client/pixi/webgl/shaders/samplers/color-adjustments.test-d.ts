import { expectTypeOf } from "vitest";

const CASS = ColorAdjustmentsSamplerShader;
let myCASS;

expectTypeOf(CASS.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(CASS.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(CASS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(CASS.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf((myCASS = CASS.create())).toEqualTypeOf<ColorAdjustmentsSamplerShader>();

expectTypeOf(myCASS.paused).toEqualTypeOf<boolean>();
expectTypeOf(myCASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myCASS.linkedToDarknessLevel).toEqualTypeOf<boolean>();

const ASS = AmplificationSamplerShader;
let myASS;

expectTypeOf(CASS.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(ASS.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(ASS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(ASS.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf((myASS = ASS.create())).toEqualTypeOf<AmplificationSamplerShader>();

expectTypeOf(myASS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myASS.colorTint).toEqualTypeOf<Color.RGBColorVector>();
