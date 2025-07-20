import { expectTypeOf } from "vitest";
import type { EmptyObject } from "fvtt-types/utils";

// eslint-disable-next-line import-x/extensions
import "fvtt-types/workers";

declare const someBlob: Blob;
declare const someBuffer: Uint8ClampedArray;
declare const outBuffer: ArrayBuffer;
declare const someOC: OffscreenCanvas;

expectTypeOf(
  processBufferToBase64({
    buffer: someBuffer,
    width: 500,
    height: 500,
    type: "image/webp",
    quality: 0.8,
    debug: true,
    hash: "asdageherhr",
    skipHash: true,
  }),
).toEqualTypeOf<Promise<BufferOperationReturn<ProcessBufferToBase64Result>>>();

expectTypeOf(
  processBufferRedToBufferRGBA({
    buffer: someBuffer,
    width: 500,
    height: 500,
    debug: true,
    hash: "asfasfgdgha",
    out: outBuffer,
    skipHash: false,
  }),
).toEqualTypeOf<Promise<BufferOperationReturn<ProcessBufferRedToBufferRGBAResult>>>();

expectTypeOf(
  processBufferRGBAToBufferRED({
    buffer: someBuffer,
    width: 500,
    height: 500,
    debug: undefined,
    hash: undefined,
    out: undefined,
    skipHash: undefined,
  }),
).toEqualTypeOf<Promise<BufferOperationReturn<ProcessBufferRGBAToBufferRedResult>>>();

expectTypeOf(
  copyBuffer({
    buffer: someBuffer,
    debug: true,
    hash: "asfasfgdgha",
    out: outBuffer,
    skipHash: false,
  }),
).toEqualTypeOf<Promise<BufferOperationReturn<CopyBufferResult>>>();

expectTypeOf(controlHashes(someBuffer)).toEqualTypeOf<EmptyObject>();
expectTypeOf(controlHashes(someBuffer, "some hash")).toEqualTypeOf<ControlHashesReturnObject>();

expectTypeOf(pixelsToOffscreenCanvas(someBuffer, 500, 500, { debug: true })).toEqualTypeOf<OffscreenCanvas>();

expectTypeOf(offscreenToBase64(someOC, "image/jpeg", 0.85)).toEqualTypeOf<Promise<string>>();

expectTypeOf(blobToBase64(someBlob)).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  expandBuffer(someBuffer, 500, 500, { out: undefined, debug: undefined }),
).toEqualTypeOf<Uint8ClampedArray>();

expectTypeOf(reduceBuffer(someBuffer, 500, 500, { out: outBuffer, debug: false })).toEqualTypeOf<Uint8ClampedArray>();
