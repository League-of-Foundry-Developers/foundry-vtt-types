import type { InexactPartial } from "../../../types/utils.d.mts";

declare global {
  /**
   * A helper class to provide common functionality for working with Image objects
   */
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
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
      options?: InexactPartial<ImageHelper.CompositeOptions & ImageHelper.TextureToImageOptions>,
    ): Promise<ImageHelper.ThumbnailReturn>;

    /**
     * Composite a canvas object by rendering it to a single texture
     * @param object  - The DisplayObject to render to a texture
     * @param options - Additional named options
     *                  (default: `{}`)
     * @returns The composite Texture object
     */
    static compositeCanvasTexture(
      object: PIXI.DisplayObject,
      options?: InexactPartial<ImageHelper.CompositeOptions>,
    ): PIXI.Texture;

    /**
     * Extract a texture to a base64 PNG string
     * @param texture - The Texture object to extract
     * @param options - (default: `{}`)
     * @returns A base64 png string of the texture
     */
    static textureToImage(
      texture: PIXI.Texture,
      options?: InexactPartial<ImageHelper.TextureToImageOptions>,
    ): Promise<string>;

    /**
     * Asynchronously convert a DisplayObject container to base64 using Canvas#toBlob and FileReader
     * @param target  - A PIXI display object to convert
     * @param type    - The requested mime type of the output, default is image/png
     * @param quality - A number between 0 and 1 for image quality if image/jpeg or image/webp
     * @returns A processed base64 string
     */
    static pixiToBase64(target: PIXI.DisplayObject, type: string, quality: number): Promise<string>;

    /**
     * Asynchronously convert a canvas element to base64.
     * @param type    - (default: `["image/png"]`)
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
      options?: {
        /** The data storage location to which the file should be uploaded (default: `"data"`) */
        storage: string;
        /** The MIME type of the file being uploaded */
        type?: foundry.CONST.IMAGE_FILE_EXTENSIONS;
        /** Display a UI notification when the upload is processed. (default: `true`)  */
        notify: boolean;
      },
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
      options: InexactPartial<ImageHelper.PixelsToCanvasOptions>,
    ): HTMLCanvasElement;
  }

  namespace ImageHelper {
    /**
     * An interface for options for the {@link ImageHelper.createThumbnail} and {@link ImageHelper.compositeCanvasTexture}
     * methods.
     */
    interface CompositeOptions {
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
    }

    interface TextureToImageOptions {
      /**
       * Image format, e.g. "image/jpeg" or "image/webp".
       * @defaultValue `"image/png"`
       */
      format: string;

      /**
       * JPEG or WEBP compression from 0 to 1. Default is 0.92.
       * @defaultValue `0.92`
       */
      quality: number;
    }

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

    interface PixelsToCanvasOptions {
      /** The element to use. */
      element: HTMLCanvasElement;
      /** Specified width for the element (default to buffer image width). */
      ew: number;
      /** Specified height for the element (default to buffer image height). */
      eh: number;
    }
  }
}
