import { expectTypeOf } from "vitest";

const PBSS = PrimaryBaseSamplerShader;
let myPBSS;

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(PBSS.reservedTextureUnits).toEqualTypeOf<number>();
expectTypeOf(PBSS.classPluginName).toEqualTypeOf<string>();
expectTypeOf(PBSS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(PBSS.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  PBSS["_packInterleavedGeometry"](
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
expectTypeOf((myPBSS = PBSS.create())).toEqualTypeOf<PrimaryBaseSamplerShader>();

expectTypeOf(myPBSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myPBSS.pluginName).toEqualTypeOf<string | null>();
