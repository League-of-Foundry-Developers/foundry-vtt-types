import { expectTypeOf } from "vitest";

import AmplificationBackgroundVisionShader = foundry.canvas.rendering.shaders.AmplificationBackgroundVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const ABVS = AmplificationBackgroundVisionShader;
let myABVS;

expectTypeOf(ABVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(ABVS.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myABVS = ABVS.create())).toEqualTypeOf<AmplificationBackgroundVisionShader>();

expectTypeOf(myABVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myABVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
