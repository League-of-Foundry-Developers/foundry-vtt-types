import { expectTypeOf } from "vitest";
import { OccludableSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";
import { BatchRenderer } from "#client/canvas/rendering/batching/_module.mjs";

const myOSS = OccludableSamplerShader.create();
expectTypeOf(myOSS).toEqualTypeOf<OccludableSamplerShader>();

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(OccludableSamplerShader.reservedTextureUnits).toEqualTypeOf<number>();
expectTypeOf(OccludableSamplerShader.classPluginName).toEqualTypeOf<string>();
expectTypeOf(OccludableSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(OccludableSamplerShader.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  OccludableSamplerShader["_packInterleavedGeometry"](
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

expectTypeOf(myOSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myOSS.pluginName).toEqualTypeOf<string | null>();
