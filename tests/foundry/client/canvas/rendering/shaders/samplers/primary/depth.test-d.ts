import { expectTypeOf } from "vitest";
import { DepthSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";
import { BatchRenderer } from "#client/canvas/rendering/batching/_module.mjs";

const myDSS = DepthSamplerShader.create();
expectTypeOf(myDSS).toEqualTypeOf<DepthSamplerShader>();

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(DepthSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(DepthSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(DepthSamplerShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(DepthSamplerShader.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  DepthSamplerShader["_packInterleavedGeometry"](
    {
      _texture: someTex,
      elevation: 0,
      fadeOcclusion: 0,
      indices: someU16Array,
      radialOcclusion: 0,
      textureAlphaThreshold: 0,
      uvs: someF32Array,
      vertexData: someF32Array,
      visionOcclusion: 0,
    },
    someVB,
    someU16Array,
    0,
    0,
  ),
).toEqualTypeOf<void>();

expectTypeOf(myDSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myDSS.pluginName).toEqualTypeOf<string | null>();
