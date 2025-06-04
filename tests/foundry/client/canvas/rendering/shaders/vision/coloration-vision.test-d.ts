import { expectTypeOf } from "vitest";
import { AbstractBaseShader, ColorationVisionShader } from "#client/canvas/rendering/shaders/_module.mjs";

const CVS = ColorationVisionShader;
let myCVS;

expectTypeOf(CVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(CVS.SHADER_HEADER).toEqualTypeOf<string>();
expectTypeOf((myCVS = CVS.create())).toEqualTypeOf<ColorationVisionShader>();

expectTypeOf(myCVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myCVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
