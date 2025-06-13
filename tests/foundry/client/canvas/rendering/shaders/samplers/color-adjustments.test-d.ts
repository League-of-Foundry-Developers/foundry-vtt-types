import { expectTypeOf } from "vitest";
import { AbstractBaseShader, ColorAdjustmentsSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myCASS = ColorAdjustmentsSamplerShader.create();

expectTypeOf(myCASS).toEqualTypeOf<ColorAdjustmentsSamplerShader>();

expectTypeOf(ColorAdjustmentsSamplerShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(ColorAdjustmentsSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(ColorAdjustmentsSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(ColorAdjustmentsSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();

expectTypeOf(myCASS.paused).toEqualTypeOf<boolean>();
expectTypeOf(myCASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myCASS.linkedToDarknessLevel).toEqualTypeOf<boolean>();

expectTypeOf(myCASS.linkedToDarknessLevel).toBeBoolean();
myCASS.linkedToDarknessLevel = true; // setter

expectTypeOf(myCASS.contrast).toBeNumber();
myCASS.contrast = 0.2; // setter

expectTypeOf(myCASS.exposure).toBeNumber();
myCASS.exposure = 0.2; // setter

expectTypeOf(myCASS.saturation).toBeNumber();
myCASS.saturation = 0.2; // setter
