import { expectTypeOf } from "vitest";

import AdaptiveDarknessShader = foundry.canvas.rendering.shaders.AdaptiveDarknessShader;

let myADS;

expectTypeOf(AdaptiveDarknessShader.FRAGMENT_BEGIN).toEqualTypeOf<string>();
expectTypeOf(AdaptiveDarknessShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myADS = AdaptiveDarknessShader.create())).toEqualTypeOf<AdaptiveDarknessShader>();

expectTypeOf(myADS.update()).toEqualTypeOf<void>();
expectTypeOf(myADS.isRequired).toEqualTypeOf<boolean>();
