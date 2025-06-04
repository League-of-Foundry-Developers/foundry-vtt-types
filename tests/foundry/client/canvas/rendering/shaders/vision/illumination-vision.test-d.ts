import { expectTypeOf } from "vitest";
import { AbstractBaseShader, IlluminationVisionShader } from "#client/canvas/rendering/shaders/_module.mjs";

const IVS = IlluminationVisionShader;
let myIVS;

expectTypeOf(IVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(IVS.ADJUSTMENTS).toEqualTypeOf<string>();
expectTypeOf((myIVS = IVS.create())).toEqualTypeOf<IlluminationVisionShader>();

expectTypeOf(myIVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
