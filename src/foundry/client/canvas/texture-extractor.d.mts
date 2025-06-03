import type { Brand, Identity, InexactPartial } from "#utils";

/**
 * A class or interface that provide support for WebGL async read pixel/texture data extraction.
 */
declare class TextureExtractor {
  /**
   * @param renderer - The renderer
   * @param config - Worker initialization options
   */
  constructor(renderer: PIXI.Renderer, config?: TextureExtractor.ConstructorOptions);

  /**
   * List of compression that could be applied with extraction
   */
  static COMPRESSION_MODES: TextureExtractor.CompressionModes;

  /**
   * The WebGL2 renderer.
   */
  get renderer(): PIXI.Renderer;

  /**
   * The texture format on which the Texture Extractor must work.
   */
  get format(): PIXI.FORMATS;

  /**
   * The texture type on which the Texture Extractor must work.
   */
  get type(): PIXI.TYPES;

  /**
   * Debug flag.
   * @defaultValue `false`
   */
  debug: boolean;

  /**
   * Extract a rectangular block of pixels from the texture (without un-pre-multiplying).
   * @param options - Options which configure pixels extraction behavior
   * @returns The pixels or undefined if there's no change compared to the last time pixels were extracted and
   * the control hash option is enabled. If an output buffer was passed, the (new) output buffer is included
   * in the result, which may be different from the output buffer that was passed because it was detached.
   */
  extract(options?: TextureExtractor.PixelsExtractionOptions): Promise<TextureExtractor.PixelsExtractReturn>;

  /**
   * Extract a rectangular block of pixels from the texture (without un-pre-multiplying).
   * @param options - Options with configure base64 extraction behaviour
   * @returns The base64 string or undefined if there's no change compared
   * to the last time base64 was extracted and the control hash option is enabled.
   */
  extract(options: TextureExtractor.Base64ExtractionOptions): Promise<string | undefined>;

  /**
   * Free all the bound objects.
   */
  reset(): void;

  /**
   * Destroy this TextureExtractor.
   */
  destroy(): void;

  /**
   * Called by the renderer contextChange runner.
   */
  contextChange(): void;

  #TextureExtractor: true;
}

declare namespace TextureExtractor {
  interface Any extends AnyTextureExtractor {}
  interface AnyConstructor extends Identity<typeof AnyTextureExtractor> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The caller name
     * @defaultValue `"TextureExtractor"`
     */
    callerName: string;

    /**
     * Should ues control hash?
     * @defaultValue `false`
     */
    controlHash: boolean;

    /**
     * The texture format
     * @defaultValue `PIXI.FORMATS.RED`
     */
    format: PIXI.FORMATS;

    /**
     * Enable debug log?
     * @defaultValue `false`
     */
    debug: boolean;
  }>;

  /** Options for the constructor of {@linkcode TextureExtractor} */
  interface ConstructorOptions extends _ConstructorOptions {}

  /** @internal */
  type _ExtractionOptions = InexactPartial<{
    /**
     * The texture the pixels are extracted from.
     */
    texture: PIXI.Texture | PIXI.RenderTexture;

    /** The rectangle which the pixels are extracted from. */
    frame: PIXI.Rectangle;
  }>;

  /** @internal */
  type _PixelsExtractOptions = InexactPartial<{
    /** The optional output buffer to write the pixels to. May be detached. */
    out: ArrayBuffer;
  }>;

  /** @internal */
  type _Base64ExtractionOptions = InexactPartial<{
    /**
     * The optional image mime type.
     * @defaultValue `"image/png"`
     * @remarks Only seems to be used in the `TextureExtractor##compressBufferLocal` to {@linkcode foundry.helpers.media.ImageHelper.canvasToBase64} path; ignored if using workers
     */
    type: string;

    /**
     * The optional image quality.
     * @defaultValue `1`
     * @remarks Only seems to be used in the `TextureExtractor##compressBufferLocal` to {@linkcode foundry.helpers.media.ImageHelper.canvasToBase64} path; ignored if using workers
     */
    quality: number;
  }>;

  interface PixelsExtractionOptions extends _PixelsExtractOptions, _ExtractionOptions {
    /** The NONE compression mode. */
    compression?: TextureExtractor.CompressionModes["NONE"];
  }

  interface Base64ExtractionOptions extends _Base64ExtractionOptions, _ExtractionOptions {
    /** The BASE64 compression mode. */
    compression: TextureExtractor.CompressionModes["BASE64"];
  }

  interface PixelsExtractReturn {
    pixels: Uint8ClampedArray | undefined;
    width: number;
    height: number;
    out?: ArrayBuffer;
  }

  type COMPRESSION_MODES = Brand<number, "TextureExtractor.COMPRESSION_MODES">;

  interface CompressionModes {
    NONE: 0 & COMPRESSION_MODES;
    BASE64: 1 & COMPRESSION_MODES;
  }
}

export default TextureExtractor;

declare abstract class AnyTextureExtractor extends TextureExtractor {
  constructor(...args: never);
}
