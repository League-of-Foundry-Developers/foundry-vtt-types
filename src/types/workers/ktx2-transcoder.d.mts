/**
 * @remarks Built by `KTX2Parser##getSupportedExtensions`, which returns an empty object when no WebGL context is
 * available.
 */
export interface SupportedKTX2Extensions {
  astc?: boolean | undefined;
  bptc?: boolean | undefined;
  etc?: boolean | undefined;
  s3tc?: boolean | undefined;
}

export interface TranscodeKTX2Options {
  /** A Khronos transcode target name. */
  transcodeTarget?: string | undefined;

  /** The renderer's compressed texture extensions. */
  supportedExtensions: SupportedKTX2Extensions;
}

export type TranscodeKTX2Return = [result: foundry.canvas.KTX2Parser.TranscodeResult, transfer: ArrayBuffer[]];

/**
 * The binary KTX2 identifier.
 * @defaultValue `[0xAB, 0x4B, 0x54, 0x58, 0x20, 0x32, 0x30, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A]`
 */
export declare const KTX2_IDENTIFIER: number[];

/**
 * The initialized Khronos KTX module, owned by this worker.
 * @remarks `undefined` until {@linkcode initializeKTX2} has resolved.
 */
export declare let ktx: LibKTX.Module | undefined;

/**
 * Initialize the Khronos KTX module inside the worker.
 * @param wasmPath - The absolute URL of the libktx WebAssembly module.
 * @remarks
 * @throws If the Khronos libktx module initializes an invalid module.
 */
export declare function initializeKTX2(wasmPath: string): Promise<[]>;

/**
 * Parse and transcode a KTX2 texture, transferring its mip levels to the main thread.
 * @param bytes   - The file bytes.
 * @param options - Transcoding options.
 * @returns The texture data and transferable buffers.
 * @remarks
 * @throws If {@linkcode ktx} has not been initialized, if the header is invalid or not a 2D texture, if the texture
 * cannot be transcoded to a supported target, or if a mip level cannot be read.
 */
export declare function transcodeKTX2(bytes: Uint8Array, options: TranscodeKTX2Options): TranscodeKTX2Return;

/**
 * Read a KTX2 header and validate it for Foundry's 2D texture pipeline.
 * @param bytes - The file bytes.
 * @returns The parsed header.
 * @remarks
 * @throws If the file is not a valid KTX2 file, or is not a 2D texture with non-zero dimensions.
 */
export declare function readKTX2Header(bytes: Uint8Array): foundry.canvas.KTX2Parser.Header;

/**
 * Select a Khronos target using the capabilities reported by the main thread.
 * @param options - Transcoding options.
 * @returns The selected target.
 * @remarks
 * @throws If `transcodeTarget` is not a recognized target, or if no supported compressed target is found.
 */
export declare function getKTX2TranscodeTarget(
  options: TranscodeKTX2Options,
): foundry.canvas.KTX2Parser.TranscodeTarget;
