import { expectTypeOf } from "vitest";

const CVS = ColorationVisionShader;
let myCVS;

expectTypeOf(CVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(CVS.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myCVS = CVS.create())).toEqualTypeOf<ColorationVisionShader>();

expectTypeOf(myCVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myCVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
