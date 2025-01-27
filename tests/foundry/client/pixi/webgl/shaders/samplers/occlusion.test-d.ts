import { expectTypeOf } from "vitest";

const OSS = OccludableSamplerShader;
let myOSS;

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(OSS.reservedTextureUnits).toEqualTypeOf<number>();
expectTypeOf(OSS.classPluginName).toEqualTypeOf<string>();
expectTypeOf(OSS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(OSS.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  OSS["_packInterleavedGeometry"](
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
expectTypeOf((myOSS = OSS.create())).toEqualTypeOf<OccludableSamplerShader>();

expectTypeOf(myOSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myOSS.pluginName).toEqualTypeOf<string | null>();
