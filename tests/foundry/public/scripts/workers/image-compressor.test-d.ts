import { expectTypeOf } from "vitest";
import type { EmptyObject } from "fvtt-types/utils";
import type * as _ from "fvtt-types/worker";

declare const someBlob: Blob;
declare const someBuffer: Uint8ClampedArray;
declare const someOC: OffscreenCanvas;

expectTypeOf(
  processBufferToBase64({
    buffer: someBuffer,
    width: 500,
    height: 500,
    type: "image/webp",
    quality: 0.8,
    readFormat: PIXI.FORMATS.RED,
    debug: true,
    hash: "asdageherhr",
  }),
).toEqualTypeOf<Promise<ProcessBufferToBase64Return>>();

expectTypeOf(
  processBufferRedToBufferRGBA({
    buffer: someBuffer,
    width: 500,
    height: 500,
    debug: true,
    hash: "asfasfgdgha",
  }),
).toEqualTypeOf<Promise<ProcessBufferRedToBufferRGBAReturn>>();

expectTypeOf(
  processBufferRGBAToBufferRED({
    buffer: someBuffer,
    width: 500,
    height: 500,
    debug: true,
    hash: "asdfasdf",
  }),
).toEqualTypeOf<Promise<ProcessBufferRGBAToBufferREDReturn>>();

expectTypeOf(controlHashes(someBuffer)).toEqualTypeOf<EmptyObject>();
expectTypeOf(controlHashes(someBuffer, "some hash")).toEqualTypeOf<{ same: boolean; hash: string }>();

expectTypeOf(pixelsToOffscreenCanvas(someBuffer, 500, 500, { debug: true })).toEqualTypeOf<OffscreenCanvas>();

expectTypeOf(offscreenToBase64(someOC, "image/jpeg", 0.85)).toEqualTypeOf<Promise<string>>();

expectTypeOf(blobToBase64(someBlob)).toEqualTypeOf<Promise<string>>();

expectTypeOf(expandBuffer(someBuffer, 500, 500, { debug: undefined })).toEqualTypeOf<Uint8ClampedArray>();

expectTypeOf(reduceBuffer(someBuffer, 500, 500, { debug: null })).toEqualTypeOf<Uint8ClampedArray>();
