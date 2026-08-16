import { expectTypeOf } from "vitest";
import KTX2Parser = foundry.canvas.KTX2Parser;

expectTypeOf(KTX2Parser.WASM_PATH).toBeString();
expectTypeOf(KTX2Parser.detectKTX2).toEqualTypeOf<PIXI.FormatDetectionParser>();
expectTypeOf(KTX2Parser.resolveKTX2TextureUrl).toEqualTypeOf<PIXI.ResolveURLParser>();
expectTypeOf(KTX2Parser.loadKTX2).toEqualTypeOf<PIXI.LoaderParser<PIXI.Texture>>();

expectTypeOf(KTX2Parser.module).toEqualTypeOf<LibKTX.Module | null>();
expectTypeOf(KTX2Parser.initialized).toBeBoolean();

expectTypeOf(KTX2Parser.initialize()).toEqualTypeOf<Promise<LibKTX.Module>>();
expectTypeOf(KTX2Parser.initialize({})).toEqualTypeOf<Promise<LibKTX.Module>>();
expectTypeOf(KTX2Parser.initialize({ wasmPath: "scripts/ktx2/libktx.wasm" })).toEqualTypeOf<Promise<LibKTX.Module>>();
expectTypeOf(KTX2Parser.initialize({ wasmPath: undefined })).toEqualTypeOf<Promise<LibKTX.Module>>();

expectTypeOf(KTX2Parser.loadResource("foo.ktx2")).toEqualTypeOf<Promise<PIXI.CompressedTextureResource>>();
expectTypeOf(KTX2Parser.loadResource("foo.ktx2", { transcodeTarget: "BC7_RGBA" })).toEqualTypeOf<
  Promise<PIXI.CompressedTextureResource>
>();

declare const buffer: ArrayBuffer;
declare const bytes: Uint8Array;

expectTypeOf(KTX2Parser.parse(buffer)).toEqualTypeOf<Promise<PIXI.CompressedTextureResource>>();
expectTypeOf(KTX2Parser.parse(bytes, { transcodeTarget: undefined })).toEqualTypeOf<
  Promise<PIXI.CompressedTextureResource>
>();
