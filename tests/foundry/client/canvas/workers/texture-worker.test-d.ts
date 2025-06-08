import { expectTypeOf } from "vitest";
import { TextureCompressor } from "#client/canvas/workers/_module.mjs";
import type {
  BufferOperationReturn,
  CopyBufferResult,
  ProcessBufferRedToBufferRGBAResult,
  ProcessBufferRGBAToBufferRedResult,
  ProcessBufferToBase64Result,
} from "../../../../../src/types/workers/image-compressor.mjs";

const myTC = new TextureCompressor("foobar", {
  debug: true,
  scripts: ["./foobar"],
  loadPrimitives: true,
  controlHash: true,
});

const someBuffer = new Uint8ClampedArray();

const compressedBase64 = await myTC.compressBufferBase64(someBuffer, 2, 3, {
  debug: true,
  hash: "foobar",
});
if (Array.isArray(compressedBase64)) {
  expectTypeOf(compressedBase64).toEqualTypeOf<BufferOperationReturn<ProcessBufferToBase64Result>>();
} else {
  expectTypeOf(compressedBase64).toEqualTypeOf<ProcessBufferToBase64Result>();
}

declare const outBuffer: ArrayBuffer;
const redToRGBA = await myTC.expandBufferRedToBufferRGBA(someBuffer, 2, 3, {
  out: outBuffer,
  debug: true,
  hash: undefined,
});
if (Array.isArray(redToRGBA)) {
  expectTypeOf(redToRGBA).toEqualTypeOf<BufferOperationReturn<ProcessBufferRedToBufferRGBAResult>>();
} else {
  expectTypeOf(redToRGBA).toEqualTypeOf<ProcessBufferRedToBufferRGBAResult>();
}

const RGBAToRed = await myTC.reduceBufferRGBAToBufferRED(someBuffer, 2, 3, {
  out: undefined,
  debug: undefined,
  hash: undefined,
});
if (Array.isArray(RGBAToRed)) {
  expectTypeOf(RGBAToRed).toEqualTypeOf<BufferOperationReturn<ProcessBufferRGBAToBufferRedResult>>();
} else {
  expectTypeOf(RGBAToRed).toEqualTypeOf<ProcessBufferRGBAToBufferRedResult>();
}

const copiedBuffer = await myTC.copyBuffer(someBuffer, {
  out: outBuffer,
  debug: true,
  hash: undefined,
});
if (Array.isArray(copiedBuffer)) {
  expectTypeOf(copiedBuffer).toEqualTypeOf<BufferOperationReturn<CopyBufferResult>>();
} else {
  expectTypeOf(copiedBuffer).toEqualTypeOf<CopyBufferResult>();
}
