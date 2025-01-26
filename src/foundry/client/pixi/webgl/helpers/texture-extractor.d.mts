import type { Brand, InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * A class or interface that provide support for WebGL async read pixel/texture data extraction.
   */
  class TextureExtractor {
    constructor(renderer: PIXI.Renderer, options?: TextureExtractor.ConstructorOptions);

    /**
     * List of compression that could be applied with extraction
     */
    static COMPRESSION_MODES: {
      NONE: 0 & TextureExtractor.COMPRESSION_MODES;
      BASE64: 1 & TextureExtractor.COMPRESSION_MODES;
    };

    /**
     * Debug flag.
     */
    debug: boolean;

    /**
     * The reference to the pixel buffer.
     */
    pixelBuffer: Uint8ClampedArray;

    /**
     * Extract a rectangular block of pixels from the texture (without un-pre-multiplying).
     * @param options - Options which configure extraction behavior
     */
    extract(options?: TextureExtractor.TextureExtractionOptions): Promise<string | Uint8ClampedArray>;

    /**
     * Free all the bound objects.
     */
    reset(): void;

    /**
     * Called by the renderer contextChange runner.
     */
    contextChange(): void;
  }

  namespace TextureExtractor {
    type Any = AnyTextureExtractor;
    type AnyConstructor = typeof AnyTextureExtractor;

    /** @internal */
    type _ConstructorOptions = InexactPartial<{
      /**
       * The caller name associated with this instance of texture extractor (optional, used for debug)
       * @defaultValue `"TextureExtractor"`
       * @remarks Default provided if null
       */
      callerName: string | null;

      /**
       * Does the TextureCompressor neeed to control the hash?
       * @remarks Passed to `new TextureCompressor()`, where it is provided a default of `false` if null
       */
      controlHash: boolean | null;

      /**
       * The PIXI Format this TextureExtractor uses
       * @defaultValue `PIXI.FORMATS.RED`
       * @remarks Construction throws if this isn't `.RED` or `.RGBA`, so can't be null
       */
      format: PIXI.FORMATS;
    }>;

    /** Options for the constructor of {@link TextureExtractor} */
    interface ConstructorOptions extends _ConstructorOptions {}

    /** @internal */
    type _ExtractOptions = InexactPartial<{
      /**
       * The texture the pixels are extracted from.
       * Otherwise, extract from the renderer.
       * @remarks Can't be null despite Foundry's typedef claiming it can, as eventually `texture?.baseTexture.resolution` is accessed
       */
      texture: PIXI.Texture | PIXI.RenderTexture;

      /** The rectangle which the pixels are extracted from. */
      frame: PIXI.Rectangle;

      /** The compression mode to apply, or NONE */
      compression: TextureExtractor.COMPRESSION_MODES;

      /**
       * The optional image mime type.
       * @privateRemarks Allowed to be null because it has an `??` default in `TextureExtractor##compressBufferWorker`
       * via `##compressBuffer`, the only place it is actually used, despite being passed to other functions as well
       */
      type: string | null;

      /**
       * The optional image quality.
       *  @privateRemarks Foundry types as `string` but is clearly meant to be `number` by usage. Allowing null due to
       * it having a `??` default in the path any browser someone is realistically using for Foundry will take.
       */
      quality: number | null;

      /** The optional debug flag to use. */
      debug: boolean | null;
    }>;

    /** Options for {@link TextureExtractor#extract} */
    interface TextureExtractionOptions extends _ExtractOptions {}

    type COMPRESSION_MODES = Brand<number, "TextureExtractor.COMPRESSION_MODES">;
  }
}

declare abstract class AnyTextureExtractor extends TextureExtractor {
  constructor(arg0: never, ...args: never[]);
}
