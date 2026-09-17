import { expectTypeOf } from "vitest";

// eslint-disable-next-line import-x/extensions
import "fvtt-types/workers";

declare const bytes: Uint8Array;

const options: TranscodeKTX2Options = { supportedExtensions: { astc: true, s3tc: false } };

expectTypeOf(options.supportedExtensions).toEqualTypeOf<SupportedKTX2Extensions>();
transcodeKTX2(bytes, { supportedExtensions: {} });

// @ts-expect-error `supportedExtensions` only has the four compressed texture extension keys
transcodeKTX2(bytes, { supportedExtensions: { pvrtc: true } });

expectTypeOf(KTX2_IDENTIFIER).toEqualTypeOf<number[]>();
expectTypeOf(ktx).toEqualTypeOf<LibKTX.Module | undefined>();

expectTypeOf(initializeKTX2("https://example.com/scripts/ktx2/libktx.wasm")).toEqualTypeOf<Promise<[]>>();

const [result, transfer] = transcodeKTX2(bytes, options);
expectTypeOf(result).toEqualTypeOf<foundry.canvas.KTX2Parser.TranscodeResult>();
expectTypeOf(transfer).toEqualTypeOf<ArrayBuffer[]>();
expectTypeOf(transcodeKTX2(bytes, { ...options, transcodeTarget: "BC7_RGBA" })).toEqualTypeOf<TranscodeKTX2Return>();

expectTypeOf(readKTX2Header(bytes)).toEqualTypeOf<foundry.canvas.KTX2Parser.Header>();
expectTypeOf(getKTX2TranscodeTarget(options)).toEqualTypeOf<foundry.canvas.KTX2Parser.TranscodeTarget>();

// @ts-expect-error `supportedExtensions` is required
transcodeKTX2(bytes, {});
