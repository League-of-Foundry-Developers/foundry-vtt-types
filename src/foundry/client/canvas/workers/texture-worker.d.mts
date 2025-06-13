import type { Identity, InexactPartial, NullishProps } from "#utils";
import type {
  BufferOperationReturn,
  CopyBufferResult,
  ProcessBufferRGBAToBufferRedResult,
  ProcessBufferRedToBufferRGBAResult,
  ProcessBufferToBase64Result,
} from "../../../../types/workers/image-compressor.d.mts";

/**
 * Wrapper for a web worker meant to convert a pixel buffer to the specified image format
 * and quality and return a base64 image
 */
declare class TextureCompressor extends foundry.helpers.AsyncWorker {
  /**
   * @param name   - The worker name to be initialized (default: `"TextureCompressor"`)
   * @param config - Worker initialization options
   */
  constructor(name?: string, config?: TextureCompressor.ConstructorOptions);

  /**
   * Process the non-blocking image compression to a base64 string.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   * @remarks If the texture buffer is unchanged, returns only a `Result` object, not a `[Result, ArrayBufferLike[]]]` tuple
   */
  compressBufferBase64(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.CompressBufferBase64Options,
  ): Promise<TextureCompressor.BufferOperationReturnOrResult<ProcessBufferToBase64Result>>;

  /**
   * Expand a buffer in RED format to a buffer in RGBA format.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   * @remarks If the texture buffer is unchanged, returns only a `Result` object, not a `[Result, ArrayBufferLike[]]]` tuple
   */
  expandBufferRedToBufferRGBA(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.ExpandBufferOptions,
  ): Promise<TextureCompressor.BufferOperationReturnOrResult<ProcessBufferRedToBufferRGBAResult>>;

  /**
   * Expand a buffer in RED format to a buffer in RGBA format.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   * @remarks If the texture buffer is unchanged, returns only a `Result` object, not a `[Result, ArrayBufferLike[]]]` tuple
   */
  reduceBufferRGBAToBufferRED(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.ReduceBufferOptions,
  ): Promise<TextureCompressor.BufferOperationReturnOrResult<ProcessBufferRGBAToBufferRedResult>>;

  /**
   * Copy a buffer.
   * @param buffer - Buffer used to create the image data.
   */
  copyBuffer(
    buffer: Uint8ClampedArray,
    options?: TextureCompressor.CopyBufferOptions,
  ): Promise<TextureCompressor.BufferOperationReturnOrResult<CopyBufferResult>>;

  #TextureCompressor: true;
}

declare namespace TextureCompressor {
  interface Any extends AnyTextureCompressor {}
  interface AnyConstructor extends Identity<typeof AnyTextureCompressor> {}

  /** @internal */
  type _ConstructorOptions = NullishProps<{
    /**
     * Should the worker run in debug mode?
     * @defaultValue `false`
     */
    debug: boolean;

    /**
     * @defaultValue `["/scripts/workers/image-compressor.js", "/scripts/spark-md5.min.js"]`
     * @remarks Undocumented by Foundry
     */
    scripts: string[];

    /**
     * @defaultValue `false`
     * @remarks Undocumented by Foundry
     */
    loadPrimitives: boolean;

    /**
     * Do we need to control the hash?
     * @defaultValue `false`
     */
    controlHash: boolean;
  }>;

  /** Options for the {@linkcode TextureCompressor} constructor */
  interface ConstructorOptions extends _ConstructorOptions {}

  /** @internal */
  type _CommonOptions = InexactPartial<{
    /** The precomputed hash. */
    hash: string;

    /** The debug option. */
    debug: boolean;
  }>;

  /** @internal */
  type _Out = InexactPartial<{
    /** The output buffer to write the reduced pixels to. May be detached. */
    out: ArrayBuffer;
  }>;

  interface CompressBufferBase64Options extends _CommonOptions {
    // Foundry still lists the properties `type` and `quality` in the typedef,  but `compressBufferBase64`
    // no longer passes them along to the worker script, so they're unused as of v13
  }

  interface ExpandBufferOptions extends _CommonOptions, _Out {}

  interface ReduceBufferOptions extends _CommonOptions, _Out {}

  interface CopyBufferOptions extends _CommonOptions, _Out {}

  /**
   * @remarks As of v13, {@linkcode TextureCompressor.compressBufferBase64 | TextureCompressor#compressBufferBase64},
   * {@linkcode TextureCompressor.expandBufferRedToBufferRGBA | #expandBufferRedToBufferRGBA},
   * {@linkcode TextureCompressor.reduceBufferRGBAToBufferRED | #reduceBufferRGBAToBufferRed},
   * and {@linkcode TextureCompressor.copyBuffer | #copyBuffer} will all return simply
   * their ResultType if the TextureCompressor instance was constructed with `config.controlHash: true`,
   * and the relevant texture buffer is unchanged from the last time the operation in question was performed
   */
  type BufferOperationReturnOrResult<ResultType> = BufferOperationReturn<ResultType> | ResultType;
}

export default TextureCompressor;

declare abstract class AnyTextureCompressor extends TextureCompressor {
  constructor(...args: never);
}
