import { expectTypeOf } from "vitest";
import { TokenRing } from "#client/canvas/tokens/_module.mjs";
import { TokenRingSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";
import { BatchRenderer } from "#client/canvas/rendering/batching/_module.mjs";

const myTRSS = TokenRingSamplerShader.create();
expectTypeOf(myTRSS).toEqualTypeOf<TokenRingSamplerShader>();

declare const someVB: PIXI.ViewableBuffer;
declare const someU16Array: Uint16Array;
declare const someF32Array: Float32Array;
declare const someTex: PIXI.Texture;
declare const someRing: TokenRing;

expectTypeOf(TokenRingSamplerShader.nullUvs).toEqualTypeOf<Float32Array>();
expectTypeOf(TokenRingSamplerShader.classPluginName).toEqualTypeOf<string>();
expectTypeOf(TokenRingSamplerShader["_batchFragmentShader"]).toEqualTypeOf<string>();
expectTypeOf(TokenRingSamplerShader.batchDefaultUniforms).toEqualTypeOf<BatchRenderer.BatchDefaultUniformsFunction>();
expectTypeOf(
  TokenRingSamplerShader["_packInterleavedGeometry"](
    {
      object: {
        object: {
          ring: someRing,
        },
      },
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

expectTypeOf(myTRSS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myTRSS.pluginName).toEqualTypeOf<string | null>();
