import type { InexactPartial } from "../../../../../types/utils.d.mts";

export {};

declare abstract class AnyTextureExtractor extends TextureExtractor {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace TextureExtractor {
    type AnyConstructor = typeof AnyTextureExtractor;

    interface ConstructorOptions {
      /** @defaultValue `"TextureExtractor"` */
      callerName: string;

      controlHash: boolean;

      /** @defaultValue `PIXI.FORMATS.RED` */
      format: PIXI.FORMATS;
    }

    interface TextureExtractionOptions {
      /**
       * The texture the pixels are extracted from.
       * Otherwise, extract from the renderer.
       */
      texture: PIXI.Texture | PIXI.RenderTexture | null;

      /** The rectangle which the pixels are extracted from. */
      frame: PIXI.Rectangle;

      /** The compression mode to apply, or NONE */
      compression: (typeof TextureExtractor)["COMPRESSION_MODES"];

      /** The optional image mime type. */
      type: string;

      /** The optional image quality. */
      quality: string;

      /** The optional debug flag to use. */
      debug: boolean;
    }
  }

  /**
   * A class or interface that provide support for WebGL async read pixel/texture data extraction.
   */
  class TextureExtractor {
    constructor(
      renderer: PIXI.Renderer,
      { callerName, controlHash, format }?: InexactPartial<TextureExtractor.ConstructorOptions>,
    );

    /**
     * List of compression that could be applied with extraction
     */
    static COMPRESSION_MODES: {
      readonly NONE: 0;
      readonly BASE64: 1;
      [compressionMode: string]: number;
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
    extract(options: InexactPartial<TextureExtractor.TextureExtractionOptions>): ReturnType<Semaphore["add"]>;

    /**
     * Free all the bound objects.
     */
    reset(): void;

    /**
     * Called by the renderer contextChange runner.
     */
    contextChange(): void;
  }
}
