import { expectTypeOf } from "vitest";
import { AdaptiveBackgroundShader } from "#client/canvas/rendering/shaders/_module.mjs";

let myABS;

expectTypeOf(AdaptiveBackgroundShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myABS = AdaptiveBackgroundShader.create())).toEqualTypeOf<AdaptiveBackgroundShader>();

expectTypeOf(myABS.isRequired).toEqualTypeOf<boolean>();
