import type { NullishProps } from "../../../../utils/index.d.mts";

export {};

declare global {
  /**
   * Wrapper for a web worker meant to convert a pixel buffer to the specified image format
   * and quality and return a base64 image
   */
  class TextureCompressor extends AsyncWorker {
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
      options?: TextureCompressor.compressBase64Options,
    ): Promise<unknown>;

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
      options?: TextureCompressor.expandRedToRGBAOptions,
    ): Promise<unknown>;

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
      options?: TextureCompressor.reduceRGBAToRedOptions,
    ): Promise<unknown>;
  }

  namespace TextureCompressor {
    type Any = AnyTextureCompressor;
    type AnyConstructor = typeof AnyTextureCompressor;

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

    /** Options for the {@link TextureCompressor} constructor */
    interface ConstructorOptions extends _ConstructorOptions {}

    interface compressBase64Options {
      /**
       * The required image type.
       * @defaultValue `"image/png"`
       */
      type?: string;

      /**
       * The required image quality.
       * @defaultValue `1`
       */
      quality?: number;

      /**
       * The debug option.
       * @defaultValue `false`
       */
      debug?: boolean;

      readFormat: PIXI.FORMATS;
    }

    interface expandRedToRGBAOptions {
      /**
       * The debug option
       * @defaultValue `false`
       */
      debug: boolean;
    }

    interface reduceRGBAToRedOptions {
      /**
       * The debug option
       * @defaultValue `false`
       */
      debug?: boolean;

      compression: (typeof TextureExtractor)["COMPRESSION_MODES"];

      type: string;

      quality: number;
    }
  }
}

declare abstract class AnyTextureCompressor extends TextureCompressor {
  constructor(arg0: never, ...args: never[]);
}
