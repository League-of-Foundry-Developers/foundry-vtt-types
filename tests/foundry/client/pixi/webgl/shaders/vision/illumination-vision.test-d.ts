import { expectTypeOf } from "vitest";

const IVS = IlluminationVisionShader;
let myIVS;

expectTypeOf(IVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(IVS.ADJUSTMENTS).toEqualTypeOf<string>();
expectTypeOf((myIVS = IVS.create())).toEqualTypeOf<IlluminationVisionShader>();

expectTypeOf(myIVS._preRender).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
