import { expectTypeOf } from "vitest";
import { AbstractBaseShader, BackgroundVisionShader } from "#client/canvas/rendering/shaders/_module.mjs";

const BVS = BackgroundVisionShader;
let myBVS;

expectTypeOf(BVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(BVS.FRAGMENT_END).toEqualTypeOf<string>();
expectTypeOf((myBVS = BVS.create())).toEqualTypeOf<BackgroundVisionShader>();

expectTypeOf(myBVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myBVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
