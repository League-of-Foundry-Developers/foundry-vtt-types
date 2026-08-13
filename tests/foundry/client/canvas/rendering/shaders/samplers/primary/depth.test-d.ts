import { expectTypeOf } from "vitest";

import DepthSamplerShader = foundry.canvas.rendering.shaders.DepthSamplerShader;
import BatchRenderer = foundry.canvas.rendering.batching.BatchRenderer;

const myDSS = DepthSamplerShader.create();
expectTypeOf(myDSS).toEqualTypeOf<DepthSamplerShader>();

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(DepthSamplerShader.pausable).toEqualTypeOf<boolean>();
expectTypeOf(DepthSamplerShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(DepthSamplerShader.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  DepthSamplerShader["_packInterleavedGeometry"](
    {
      _texture: someTex,
      depthElevation: 0,
      occlusionElevation: 0,
      fadeOcclusion: 0,
      indices: someU16Array,
      radialOcclusion: 0,
      restrictionState: 0,
      surfaceOcclusion: 0,
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
