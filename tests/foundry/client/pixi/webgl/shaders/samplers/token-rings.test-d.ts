import { expectTypeOf } from "vitest";

const TRSS = TokenRingSamplerShader;
let myTRSS;

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(TRSS.nullUvs).toEqualTypeOf<Float32Array>();
expectTypeOf(TRSS.classPluginName).toEqualTypeOf<string>();
expectTypeOf(TRSS["_batchFragmentShader"]).toEqualTypeOf<string>();
expectTypeOf(TRSS.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  TRSS["_packInterleavedGeometry"](
    {
      _texture: someTex,
      elevation: 0,
      fadeOcclusion: 0,
      indices: someU16Array,
      radialOcclusion: 0,
      uvs: someF32Array,
      vertexData: someF32Array,
      visionOcclusion: 0,
      _tintRGB: 0,
      blendMode: PIXI.BLEND_MODES.NORMAL,
      worldAlpha: 1,
      occludedAlpha: 0.5,
      unoccludedAlpha: 1,
    },
    someVB,
    someU16Array,
    0,
    0,
  ),
).toEqualTypeOf<void>();
expectTypeOf((myTRSS = TRSS.create())).toEqualTypeOf<TokenRingSamplerShader>();

expectTypeOf(myTRSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myTRSS.pluginName).toEqualTypeOf<string | null>();
