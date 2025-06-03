import type { Identity, NullishProps } from "#utils";
import type {
  _ProcessBufferToBase64Options,
  Debug,
  ProcessBufferRedToBufferRGBAReturn,
  ProcessBufferRGBAToBufferREDReturn,
  ProcessBufferToBase64Return,
} from "../../../../types/workers/image-compressor.d.mts";

/**
 * Wrapper for a web worker meant to convert a pixel buffer to the specified image format
 * and quality and return a base64 image
 */
declare class TextureCompressor extends foundry.helpers.AsyncWorker {
  /**
   * @param name   - The worker name to be initialized
   *                 (default: `"Texture Compressor"`)
   * @param config - Worker initialization options
   */
  constructor(name?: string, config?: TextureCompressor.ConstructorOptions);

  /**
   * Process the non-blocking image compression to a base64 string.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   */
  compressBufferBase64(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.CompressBase64Options,
  ): Promise<ProcessBufferToBase64Return>;

  /**
   * Expand a buffer in RED format to a buffer in RGBA format.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   */
  expandBufferRedToBufferRGBA(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.ExpandOrReduceBufferOptions,
  ): Promise<ProcessBufferRedToBufferRGBAReturn>;

  /**
   * Expand a buffer in RED format to a buffer in RGBA format.
   * @param buffer - Buffer used to create the image data.
   * @param width  - Buffered image width.
   * @param height - Buffered image height.
   */
  reduceBufferRGBAToBufferRED(
    buffer: Uint8ClampedArray,
    width: number,
    height: number,
    options?: TextureCompressor.ExpandOrReduceBufferOptions,
  ): Promise<ProcessBufferRGBAToBufferREDReturn>;
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
     * @defaultValue `["./workers/image-compressor.js", "./spark-md5.min.js"]`
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
    controlHash?: boolean;
  }>;

  /** Options for the {@linkcode TextureCompressor} constructor */
  interface ConstructorOptions extends _ConstructorOptions {}

  interface CompressBase64Options extends _ProcessBufferToBase64Options, Debug {}

  interface ExpandOrReduceBufferOptions extends Pick<_ProcessBufferToBase64Options, "hash">, Debug {}
}

export default TextureCompressor;

declare abstract class AnyTextureCompressor extends TextureCompressor {
  constructor(...args: never);
}
