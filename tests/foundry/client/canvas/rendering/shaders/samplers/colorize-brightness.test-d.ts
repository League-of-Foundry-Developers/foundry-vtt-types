import { expectTypeOf } from "vitest";
import { AbstractBaseShader, ColorizeBrightnessShader } from "#client/canvas/rendering/shaders/_module.mjs";

const _myCBS = ColorizeBrightnessShader.create();

expectTypeOf(ColorizeBrightnessShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(ColorizeBrightnessShader.vertexShader).toBeString();
expectTypeOf(ColorizeBrightnessShader.fragmentShader).toBeString();
expectTypeOf(ColorizeBrightnessShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
