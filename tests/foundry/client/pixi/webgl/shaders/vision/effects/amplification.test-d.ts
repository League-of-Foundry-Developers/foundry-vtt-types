import { expectTypeOf } from "vitest";

const ABVS = AmplificationBackgroundVisionShader;
let myABVS;

expectTypeOf(ABVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(ABVS.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myABVS = ABVS.create())).toEqualTypeOf<AmplificationBackgroundVisionShader>();

expectTypeOf(myABVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myABVS._preRender).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
