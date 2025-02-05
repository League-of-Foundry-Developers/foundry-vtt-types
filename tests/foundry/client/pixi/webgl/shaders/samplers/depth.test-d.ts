import { expectTypeOf } from "vitest";

const DSS = DepthSamplerShader;
let myDSS;

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;

expectTypeOf(DSS.pausable).toEqualTypeOf<boolean>();
expectTypeOf(DSS.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(DSS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(DSS.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  DSS["_packInterleavedGeometry"](
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
expectTypeOf((myDSS = DSS.create())).toEqualTypeOf<DepthSamplerShader>();

expectTypeOf(myDSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myDSS.pluginName).toEqualTypeOf<string | null>();
