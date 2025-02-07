import type { EmptyObject, InexactPartial } from "../../utils/index.d.mts";

export declare const FORMATS: {
  RED: typeof PIXI.FORMATS.RED;
  RGBA: typeof PIXI.FORMATS.RGBA;
};

export interface Debug {
  /**
   * Debug option.
   * @remarks Enables logging via `console.debug`
   */
  debug?: boolean | undefined | null;
}

/** @internal */
export type _ProcessBufferToBase64Options = InexactPartial<{
  /**
   * The required image type.
   * @defaultValue `"image/png"`
   * @remarks Can't be null as it only has a parameter default
   */
  type: string;

  /**
   * The required image quality.
   * @defaultValue `1`
   * @remarks Can't be null as it only has a parameter default
   */
  quality: number;

  /**
   * Hash to test.
   * @remarks Can't be null as it's passed directly to the `controlHashes` function,
   * where it is only checked for `=== undefined`
   */
  hash: string;

  /**
   * The format the buffer is in
   * @remarks Only matters whether it's `FORMATS.RED` or not. Property is undocumented by foundry.
   */
  readFormat: PIXI.FORMATS | null;
}>;

/** @internal */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type _BaseBufferOptions = {
  /** Buffer used to create the image data. */
  buffer: Uint8ClampedArray;

  /** Buffered image width. */
  width: number;

  /** Buffered image height. */
  height: number;
};

export interface ProcessBufferToBase64Options extends _BaseBufferOptions, _ProcessBufferToBase64Options, Debug {}

export interface ExpandOrReduceBufferOptions
  extends _BaseBufferOptions,
    Debug,
    Pick<_ProcessBufferToBase64Options, "hash"> {}

export type ProcessBufferToBase64Return = [
  {
    base64img: string | undefined;
    buffer: Uint8ClampedArray;
    hash: string | undefined;
  },
  [bufferBuffer: ArrayBufferLike],
];

export type ProcessBufferRedToBufferRGBAReturn = [
  {
    rgbaBuffer: Uint8ClampedArray | undefined;
    buffer: Uint8ClampedArray;
    hash: string | undefined;
  },
  [rgbaBufferBuffer: ArrayBufferLike, bufferBuffer: ArrayBufferLike],
];

export type ProcessBufferRGBAToBufferREDReturn = [
  {
    redBuffer: Uint8ClampedArray | undefined;
    buffer: Uint8ClampedArray;
    hash: string | undefined;
  },
  [bufferBuffer: ArrayBufferLike],
];

/**
 * Process the image compression.
 */
export declare function processBufferToBase64(
  options: ProcessBufferToBase64Options,
): Promise<ProcessBufferToBase64Return>;

/**
 * Expand a single RED channel buffer into a RGBA buffer and returns it to the main thread.
 * The created RGBA buffer is transfered.
 */
export declare function processBufferRedToBufferRGBA(
  options: ExpandOrReduceBufferOptions,
): Promise<ProcessBufferRedToBufferRGBAReturn>;

/**
 * Reduce a RGBA buffer into a single RED buffer and returns it to the main thread.
 * The created RGBA buffer is transfered.
 */
export declare function processBufferRGBAToBufferRED(
  options: ExpandOrReduceBufferOptions,
): Promise<ProcessBufferRGBAToBufferREDReturn>;

/**
 * Control the hash of a provided buffer.
 * @param buffer - Buffer to control.
 * @param hash   - Hash to test.
 * @returns Returns an empty object if `hash === undefined` else returns `{same: <boolean to know if the hashes are the same>, hash: <the previous or the new hash>}`
 */
export declare function controlHashes(buffer: Uint8ClampedArray, hash?: undefined): EmptyObject;
export declare function controlHashes(buffer: Uint8ClampedArray, hash: string): { same: boolean; hash: string };
export declare function controlHashes(
  buffer: Uint8ClampedArray,
  hash?: string,
): EmptyObject | { same: boolean; hash: string };

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
  { debug }?: Debug,
): OffscreenCanvas;

/**
 * Asynchronously convert a canvas element to base64.
 * @returns The base64 string of the canvas.
 */
export declare function offscreenToBase64(
  offscreen: OffscreenCanvas,
  type?: string,
  quality?: number,
  { debug }?: Debug,
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
  { debug }?: Debug,
): Uint8ClampedArray;

/**
 * Reduce a RGBA channel buffer into a RED buffer (in-place).
 */
export declare function reduceBuffer(
  buffer: Uint8ClampedArray,
  width: number,
  height: number,
  { debug }?: Debug,
): Uint8ClampedArray;
