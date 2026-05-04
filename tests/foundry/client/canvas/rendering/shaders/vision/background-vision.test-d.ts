import { expectTypeOf } from "vitest";

import BackgroundVisionShader = foundry.canvas.rendering.shaders.BackgroundVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const BVS = BackgroundVisionShader;
let myBVS;

expectTypeOf(BVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BVS.FRAGMENT_END).toEqualTypeOf<string>();
expectTypeOf((myBVS = BVS.create())).toEqualTypeOf<BackgroundVisionShader>();

expectTypeOf(myBVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myBVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
