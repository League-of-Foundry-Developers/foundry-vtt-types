import type { EmptyObject, InexactPartial } from "#utils";

export declare const FORMATS: {
  RED: typeof PIXI.FORMATS.RED;
  RGBA: typeof PIXI.FORMATS.RGBA;
};

/** @internal */
type _CommonOptionalProperties = InexactPartial<{
  /**
   * Debug option.
   * @remarks Enables logging via `console.debug`
   */
  debug: boolean;

  /** Hash to test. */
  hash: string;

  /** Skip hash? */
  skipHash: boolean;
}>;

/** @internal */
type _ProcessBufferToBase64Options = InexactPartial<{
  /**
   * The required image type.
   * @defaultValue `"image/png"`
   */
  type: string;

  /**
   * The required image quality.
   * @defaultValue `1`
   */
  quality: number;
}>;

/** @internal */
interface _CommonRequiredProperties {
  /** Width of the image. */
  width: number;

  /** Height of the image */
  height: number;
}

type _Out = InexactPartial<{
  /** The output buffer. */
  out: ArrayBuffer;
}>;

export interface ProcessBufferToBase64Options
  extends _ProcessBufferToBase64Options,
    _CommonRequiredProperties,
    _CommonOptionalProperties {
  /** Buffer used to create the image data. */
  buffer: Uint8ClampedArray;
}

export interface ProcessBufferRedToBufferRGBAOptions
  extends _Out,
    _CommonRequiredProperties,
    _CommonOptionalProperties {
  /** Buffer to expand. */
  buffer: Uint8ClampedArray;
}

export interface ProcessBufferRGBAToBufferRedOptions
  extends _Out,
    _CommonRequiredProperties,
    _CommonOptionalProperties {
  /** Buffer to reduce. */
  buffer: Uint8ClampedArray;
}

export interface CopyBufferOptions extends _CommonOptionalProperties, _Out {
  /** Buffer to copy. */
  buffer: Uint8ClampedArray;
}

export interface Debug extends Pick<_CommonOptionalProperties, "debug"> {}

export interface ExpandOrReduceBufferOptions extends Debug, _Out {}

/** @internal */
interface _CommonResultProperties {
  buffer: Uint8ClampedArray;
  out: ArrayBuffer | undefined;
  hash: string | undefined;
}

export interface ProcessBufferToBase64Result extends Omit<_CommonResultProperties, "out"> {
  base64img: string | undefined;
}

export interface ProcessBufferRedToBufferRGBAResult extends _CommonResultProperties {
  rgbaBuffer: Uint8ClampedArray | undefined;
}

export interface ProcessBufferRGBAToBufferRedResult extends _CommonResultProperties {
  redBuffer: Uint8ClampedArray | undefined;
}

export interface CopyBufferResult extends _CommonResultProperties {
  copy: Uint8ClampedArray | undefined;
}

/**
 * @privateRemarks There isn't any point being more specific with the names of the `transfer` elements,
 * as `copyBuffer` can return `buffer.buffer` in either the first or second position
 */
export type BufferOperationReturn<ResultType> = [
  result: ResultType,
  transfer: [firstBuffer: ArrayBufferLike, secondBuffer?: ArrayBufferLike],
];

export interface ControlHashesReturnObject {
  /** boolean to know if the hashes are the same */
  same: boolean;

  /** the previous or the new hash */
  hash: string;
}

/**
 * Process the image compression.
 */
export declare function processBufferToBase64(
  options: ProcessBufferToBase64Options,
): Promise<BufferOperationReturn<ProcessBufferToBase64Result>>;

/**
 * Expand a single RED channel buffer into a RGBA buffer and returns it to the main thread.
 * The created RGBA buffer is transferred.
 */
export declare function processBufferRedToBufferRGBA(
  options: ProcessBufferRedToBufferRGBAOptions,
): Promise<BufferOperationReturn<ProcessBufferRedToBufferRGBAResult>>;

/**
 * Reduce a RGBA buffer into a single RED buffer and returns it to the main thread.
 * The created RGBA buffer is transferred.
 */
export declare function processBufferRGBAToBufferRED(
  options: ProcessBufferRGBAToBufferRedOptions,
): Promise<BufferOperationReturn<ProcessBufferRGBAToBufferRedResult>>;

/** Copy the buffer. */
export declare function copyBuffer(options: CopyBufferOptions): Promise<BufferOperationReturn<CopyBufferResult>>;

/**
 * Control the hash of a provided buffer.
 * @param buffer - Buffer to control.
 * @param hash   - Hash to test.
 * @returns Returns an empty object if `hash === undefined` else returns `{same: <boolean to know if the hashes are the same>, hash: <the previous or the new hash>}`
 */
export declare function controlHashes(buffer: Uint8ClampedArray, hash?: undefined): EmptyObject;
export declare function controlHashes(buffer: Uint8ClampedArray, hash: string): ControlHashesReturnObject;
export declare function controlHashes(
  buffer: Uint8ClampedArray,
  hash?: string,
): EmptyObject | ControlHashesReturnObject;

/**
 * Create an offscreen canvas element containing the pixel data.
 * @param buffer - Buffer used to create the image data.
 * @param width  - Buffered image width.
 * @param height - Buffered image height.
 */
export declare function pixelsToOffscreenCanvas(
  buffer: Uint8ClampedArray,
  width: number,
  height: number,
  options?: Debug,
): OffscreenCanvas;

/**
 * Asynchronously convert a canvas element to base64.
 * @returns The base64 string of the canvas.
 */
export declare function offscreenToBase64(
  offscreen: OffscreenCanvas,
  type?: string,
  quality?: number,
  options?: Debug,
): Promise<string>;

/**
 * Convert a blob to a base64 string.
 */
export declare function blobToBase64(blob: Blob): Promise<string>;

/**
 * Expand a single RED channel buffer into a RGBA buffer.
 */
export declare function expandBuffer(
  buffer: Uint8ClampedArray,
  width: number,
  height: number,
  options?: ExpandOrReduceBufferOptions,
): Uint8ClampedArray;

/**
 * Reduce a RGBA channel buffer into a RED buffer (in-place).
 */
export declare function reduceBuffer(
  buffer: Uint8ClampedArray,
  width: number,
  height: number,
  options?: ExpandOrReduceBufferOptions,
): Uint8ClampedArray;
