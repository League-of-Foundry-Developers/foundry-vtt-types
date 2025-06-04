import { expectTypeOf } from "vitest";
import { PrimaryBaseSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";
import { BatchRenderer } from "#client/canvas/rendering/batching/_module.mjs";

const myPBSS = PrimaryBaseSamplerShader.create();
expectTypeOf(myPBSS).toEqualTypeOf<PrimaryBaseSamplerShader>();

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(PrimaryBaseSamplerShader.reservedTextureUnits).toEqualTypeOf<number>();
expectTypeOf(PrimaryBaseSamplerShader.classPluginName).toEqualTypeOf<string>();
expectTypeOf(PrimaryBaseSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(PrimaryBaseSamplerShader.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  PrimaryBaseSamplerShader["_packInterleavedGeometry"](
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

expectTypeOf(myPBSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myPBSS.pluginName).toEqualTypeOf<string | null>();
