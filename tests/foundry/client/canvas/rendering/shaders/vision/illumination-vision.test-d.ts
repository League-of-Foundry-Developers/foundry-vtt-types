import { expectTypeOf } from "vitest";

import IlluminationVisionShader = foundry.canvas.rendering.shaders.IlluminationVisionShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const IVS = IlluminationVisionShader;
let myIVS;

expectTypeOf(IVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(IVS.ADJUSTMENTS).toEqualTypeOf<string>();
expectTypeOf((myIVS = IVS.create())).toEqualTypeOf<IlluminationVisionShader>();

expectTypeOf(myIVS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
