import { expectTypeOf } from "vitest";

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;

let myABS;

expectTypeOf(AdaptiveBackgroundShader.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myABS = AdaptiveBackgroundShader.create())).toEqualTypeOf<AdaptiveBackgroundShader>();

expectTypeOf(myABS.isRequired).toEqualTypeOf<boolean>();
