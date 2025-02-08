import type { InexactPartial, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A helper class to provide common functionality for working with Image objects
   */
  class ImageHelper {
    /**
     * Create thumbnail preview for a provided image path.
     * @param src     - The string URL or DisplayObject of the texture to render to a thumbnail
     * @param options - Additional named options passed to the {@link ImageHelper.compositeCanvasTexture} method
     *                  (default: `{}`)
     * @returns The parsed and converted thumbnail data
     */
    static createThumbnail(
      src: string | PIXI.DisplayObject,
      options?: ImageHelper.CompositeOptions & ImageHelper.TextureToImageOptions,
    ): Promise<ImageHelper.ThumbnailReturn> | null;

    /**
     * Test whether a source file has a supported image extension type
     * @param src - A requested image source path
     * @returns Does the filename end with a valid image extension?
     */
    static hasImageExtension(src: string): boolean;

    /**
     * Composite a canvas object by rendering it to a single texture
     * @param object  - The DisplayObject to render to a texture
     * @param options - Additional named options
     *                  (default: `{}`)
     * @returns The composite Texture object
     */
    static compositeCanvasTexture(object: PIXI.DisplayObject, options?: ImageHelper.CompositeOptions): PIXI.Texture;

    /**
     * Extract a texture to a base64 PNG string
     * @param texture - The Texture object to extract
     * @param options - (default: `{}`)
     * @returns A base64 png string of the texture
     */
    static textureToImage(texture: PIXI.Texture, options?: ImageHelper.TextureToImageOptions): Promise<string>;

    /**
     * Asynchronously convert a DisplayObject container to base64 using Canvas#toBlob and FileReader
     * @param target  - A PIXI display object to convert
     * @param type    - The requested mime type of the output, default is image/png
     * @param quality - A number between 0 and 1 for image quality if image/jpeg or image/webp
     * @returns A processed base64 string
     * @privateRemarks Foundry doesn't mark `type` or `quality` as optional, but they're passed directly to `this.canvasToBase64`, where they *are* optional.
     */
    static pixiToBase64(
      target: PIXI.DisplayObject,
      type?: foundry.CONST.IMAGE_FILE_EXTENSIONS,
      quality?: number,
    ): Promise<string>;

    /**
     * Asynchronously convert a canvas element to base64.
     * @param type    - (default: `"image/png"`)
     * @param quality - JPEG or WEBP compression from 0 to 1. Default is 0.92.
     * @returns The base64 string of the canvas.
     */
    static canvasToBase64(
      canvas: HTMLCanvasElement,
      type?: foundry.CONST.IMAGE_FILE_EXTENSIONS,
      quality?: number,
    ): Promise<string>;

    /**
     * Upload a base64 image string to a persisted data storage location
     * @param base64   - The base64 string
     * @param fileName - The file name to upload
     * @param filePath - The file path where the file should be uploaded
     * @param options  - Additional options which affect uploading
     * @returns A promise which resolves to the FilePicker upload response
     */
    static uploadBase64(
      base64: string,
      fileName: string,
      filePath: string,
      options?: ImageHelper.UploadBase64Options,
    ): Promise<ReturnType<(typeof FilePicker)["upload"]>>;

    /**
     * Create a canvas element containing the pixel data.
     * @param pixels - Buffer used to create the image data.
     * @param width  - Buffered image width.
     * @param height - Buffered image height.
     */
    static pixelsToCanvas(
      pixels: Uint8ClampedArray,
      width: number,
      height: number,
      options: ImageHelper.PixelsToCanvasOptions,
    ): HTMLCanvasElement;
  }

  namespace ImageHelper {
    /**
     * @internal Helper type to simplify NullishProps usage.
     * @remarks Letting this be NullishProps instead of InexactPartial because despite `tx` and `ty` only
     * having defaults via `{=0}`, they either get overwritten or `*=`ed which casts null to `0`, their default anyway.
     *
     */
    type _CompositeOptions = NullishProps<{
      /**
       * Center the texture in the rendered frame?
       * @defaultValue `true`
       */
      center: boolean;

      /**
       * The desired height of the output texture
       * @defaultValue The height of the object passed to {@link ImageHelper.compositeCanvasTexture}
       */
      height: number;

      /**
       * A horizontal translation to apply to the object
       * @defaultValue `0`
       */
      tx: number;

      /**
       * A vertical translation to apply to the object
       * @defaultValue `0`
       */
      ty: number;

      /**
       * The desired width of the output texture
       * @defaultValue The width of the object passed to {@link ImageHelper.compositeCanvasTexture}
       */
      width: number;
    }>;

    /**
     * An interface for options for the {@link ImageHelper.createThumbnail} and {@link ImageHelper.compositeCanvasTexture}
     * methods.
     */
    interface CompositeOptions extends _CompositeOptions {}

    type Format = "image/png" | "image/jpeg" | "image/webp";

    /**
     * @internal Helper type to simplify NullishProps usage
     * @remarks Letting this be NullishProps, as, after testing, passing null values to `HTMLCanvasElement#toBlob()`,
     * where these eventually end up, doesn't break anything and seems to apply the defaults
     */
    type _TextureToImageOptions = NullishProps<{
      /**
       * Image format, e.g. "image/jpeg" or "image/webp".
       * @defaultValue `"image/png"`
       */
      format: Format;

      /**
       * JPEG or WEBP compression from 0 to 1. Default is 0.92.
       * @defaultValue `0.92`
       */
      quality: number;
    }>;

    interface TextureToImageOptions extends _TextureToImageOptions {}

    /** @internal Intermediary type to simplify use of optionality- and nullish-permissiveness-modifying helpers */
    type _UploadBase64Options = InexactPartial<{
      /**
       * The data storage location to which the file should be uploaded
       * @remarks Can't be null because it's passed directly to `FilePicker.upload` and its only default is via signature default value
       * @defaultValue `"data"`
       */
      storage: FilePicker.SourceType;
    }> &
      NullishProps<{
        /**
         * The MIME type of the file being uploaded
         * @remarks Will be extracted from the base64 data, if not provided.
         */
        type: foundry.CONST.IMAGE_FILE_EXTENSIONS;

        /**
         * Display a UI notification when the upload is processed.
         * @defaultValue `true`
         */
        notify: boolean;
      }>;

    interface UploadBase64Options extends _UploadBase64Options {}

    /**
     * An interface for return values of the {@link ImageHelper.createThumbnail} method.
     */
    interface ThumbnailReturn {
      /**
       * The height of the {@link PIXI.Sprite}, created by {@link ImageHelper.createThumbnail}
       */
      height: number;

      /**
       * The originally passed `string` URL or DisplayObject
       */
      src: string | PIXI.DisplayObject;

      /**
       * The Texture, returned from {@link ImageHelper.compositeCanvasTexture}, with `destroy(true)` already called on it.
       */
      texture: PIXI.Texture;

      /**
       * The base64 encoded image data, returned from {@link ImageHelper.textureToImage}
       */
      thumb: string;

      /**
       * The width of the {@link PIXI.Sprite}, created by {@link ImageHelper.createThumbnail}
       */
      width: number;
    }

    type _PixelsToCanvasOptions = NullishProps<{
      /**
       * The element to use.
       * @remarks If not provided, a new HTMLCanvasElement is created.
       */
      element: HTMLCanvasElement;

      /** Specified width for the element (default to buffer image width). */
      ew: number;

      /** Specified height for the element (default to buffer image height). */
      eh: number;
    }>;

    interface PixelsToCanvasOptions extends _PixelsToCanvasOptions {}
  }
}
