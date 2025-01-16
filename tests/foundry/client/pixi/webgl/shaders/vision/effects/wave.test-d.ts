import { expectTypeOf } from "vitest";

const WBVS = WaveBackgroundVisionShader;
let myWBVS;

expectTypeOf(WBVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(WBVS.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf((myWBVS = WBVS.create())).toEqualTypeOf<WaveBackgroundVisionShader>();

expectTypeOf(myWBVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myWBVS._preRender).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

const WCVS = WaveColorationVisionShader;
let myWCVS;

expectTypeOf(WCVS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(WCVS.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf((myWCVS = WCVS.create())).toEqualTypeOf<WaveColorationVisionShader>();

expectTypeOf(myWCVS.isRequired).toEqualTypeOf<boolean>();
expectTypeOf(myWCVS._preRender).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
