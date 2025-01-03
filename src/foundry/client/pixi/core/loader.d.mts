import type { InexactPartial, NullishProps } from "../../../../utils/index.d.mts";

declare global {
  /**
   * A Loader class which helps with loading video and image textures
   */
  class TextureLoader {
    /**
     * A global reference to the singleton texture loader
     * @privateRemarks This is set outside the class via `TextureLoader.loader = new TextureLoader();`
     */
    static loader: TextureLoader;

    /**
     * The duration in milliseconds for which a texture will remain cached
     * @defaultValue `1000 * 60 * 15`
     */
    static CACHE_TTL: number;

    /**
     * Initialize the basis transcoder for PIXI.Assets
     * @privateRemarks This should be `ReturnType<typeof PIXI.TranscoderWorker.loadTranscoder> | Promise<void>` but we lack types for `@pixi/basis`
     */
    static initializeBasisTranscoder(): Promise<[void, void] | void>;

    /**
     * Check if a source has a text file extension.
     * @param src - The source.
     * @returns If the source has a text extension or not.
     */
    static hasTextExtension(src: string): boolean;

    /**
     * Use the texture to create a cached mapping of pixel alpha and cache it.
     * Cache the bounding box of non-transparent pixels for the un-rotated shape.
     * @param texture    - The provided texture
     * @param resolution - Resolution of the texture data output
     *                     (default: `1`)
     * @returns The texture data if the texture is valid, else undefined.
     */
    static getTextureAlphaData(texture: PIXI.Texture, resolution?: number): TextureLoader.TextureAlphaData | undefined;

    /**
     * Load all the textures which are required for a particular Scene
     * @param scene   - The Scene to load
     * @param options - Additional options that configure texture loading
     *                  (default: `{}`)
     */
    static loadSceneTextures(
      scene: Scene.ConfiguredInstance,
      options?: TextureLoader.LoadSceneTexturesOptions,
    ): ReturnType<TextureLoader["load"]>;

    /**
     * Load an Array of provided source URL paths
     * @param sources - The source URLs to load
     * @param options - Additional options which modify loading
     *                  (default: `{}`)
     * @returns A Promise which resolves once all textures are loaded
     */
    load(sources: string[], options?: Partial<TextureLoader.LoadOptions>): Promise<void>;

    /**
     * Load a single texture on-demand from a given source URL path
     * @param src - The source texture path to load
     * @returns The loaded texture object
     */
    loadTexture(src: string): Promise<PIXI.BaseTexture | PIXI.Spritesheet | null>;

    /**
     * Use the Fetch API to retrieve a resource and return a Blob instance for it.
     * @param  src    - The resource URL
     * @param options - Options to configure the loading behaviour.
     * @returns A Blob containing the loaded data
     */
    static fetchResource(
      src: string,
      options?: NullishProps<{
        /**
         * Append a cache-busting query parameter to the request.
         * @defaultValue `false`
         */
        bustCache: boolean;
      }>,
    ): Promise<Blob>;

    /**
     * Add an image or a sprite sheet url to the assets cache.
     * @param src - The source URL
     * @param tex - The readied texture
     */
    setCache(src: string, asset: PIXI.BaseTexture | PIXI.Spritesheet): void;

    /**
     * Retrieve a texture or a sprite sheet from the assets cache
     * @param src - The source URL
     */
    getCache(src: string): PIXI.BaseTexture | PIXI.Spritesheet | null;

    /**
     * Expire and unload assets from the cache which have not been used for more than CACHE_TTL milliseconds.
     */
    expireCache(): Promise<void>;

    /**
     * Return a URL with a cache-busting query parameter appended.
     * @param src - The source URL being attempted
     * @returns The new URL, or false on a failure.
     */
    static getCacheBustURL(src: string): string | false;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks TextureLoader#loadImageTexture is deprecated. Use TextureLoader#loadTexture instead.
     */
    loadImageTexture(src: string): ReturnType<TextureLoader["loadTexture"]>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks TextureLoader#loadVideoTexture is deprecated. Use TextureLoader#loadTexture instead.
     */
    loadVideoTexture(src: string): ReturnType<TextureLoader["loadTexture"]>;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"TextureLoader.textureBufferDataMap is deprecated without replacement. Use TextureLoader.getTextureAlphaData`
     * `to create a texture data map and cache it automatically, or create your own caching system."`
     */
    static get textureBufferDataMap(): Map<unknown, unknown>;
  }

  namespace TextureLoader {
    type AnyConstructor = typeof AnyTextureLoader;

    interface TextureAlphaData {
      /** The width of the (downscaled) texture. */
      width: number;

      /** The height of the (downscaled) texture. */
      height: number;

      /** The minimum x-coordinate with alpha \> 0. */
      minX: number;

      /** The minimum y-coordinate with alpha \> 0. */
      minY: number;

      /** The maximum x-coordinate with alpha \> 0 plus 1. */
      maxX: number;

      /** The maximum y-coordinate with alpha \> 0 plus 1. */
      maxY: number;

      /** The array containing the texture alpha values (0-255) with the dimensions (maxX-minX)×(maxY-minY). */
      data: Uint8Array;
    }

    /** @internal */
    type _LoadSceneTexturesOptions = InexactPartial<{
      /**
       * Destroy other expired textures
       * @defaultValue `true`
       */
      expireCache: boolean | null;

      /**
       * Additional sources to load during canvas initialize
       * @defaultValue `[]`
       * @remarks Can't be null because it only has a signature-provided default.
       */
      additionalSources: Array<boolean>;

      /**
       * The maximum number of textures that can be loaded concurrently
       * @remarks Can't be null becuase it is eventually passed to the constructor of
       * {@link foundry.utils.Semaphore}, with only a signature-prodivided deafult.
       */
      maxConcurrent: number;
    }>;

    /**
     * Options for {@link TextureLoader.loadSceneTextures}
     */
    interface LoadSceneTexturesOptions extends _LoadSceneTexturesOptions {}

    /** @internal */
    type _LoadOptions = InexactPartial<{
      /**
       * The status message to display in the load bar
       * @remarks Allowed to be null or undefined because ultimately `HTMLElement.textContent = undefined`
       * or `= null` (via {@link SceneNavigation.displayProgressBar}) does not error and simply blanks textContent.
       */
      message: string | null;

      /**
       * Expire other cached textures?
       * @defaultValue `false`
       */
      expireCache: boolean | null;

      /**
       * Display loading progress bar?
       * @defaultValue `true`
       */
      displayProgress: boolean | null;
    }> &
      /** @privateRemarks Can't Pick `expireCache` as it has a different default here */
      Pick<LoadSceneTexturesOptions, "maxConcurrent">;

    /** Options for {@link TextureLoader#load} */
    interface LoadOptions extends _LoadOptions {}
  }

  /**
   * Test whether a file source exists by performing a HEAD request against it
   * @param src - The source URL or path to test
   * @returns Does the file exist at the provided url?
   */
  function srcExists(src: string): Promise<boolean>;

  /**
   * Get a single texture or sprite sheet from the cache.
   * @param src - The texture path to load.
   * @returns A texture, a sprite sheet or null if not found in cache.
   */
  function getTexture(src: string): PIXI.Texture | PIXI.Spritesheet | null;

  /**
   * Load a single asset and return a Promise which resolves once the asset is ready to use
   * @param src      - The requested asset source
   * @param options  - Additional options which modify assset loading
   * @returns The loaded Texture or sprite sheet, or null if loading failed with no fallback
   */
  function loadTexture(
    src: string,
    options?: {
      /** A fallback texture URL to use if the requested source is unavailable */
      fallback?: string;
    },
  ): Promise<PIXI.Texture | PIXI.Spritesheet | null>;
}

declare abstract class AnyTextureLoader extends TextureLoader {
  constructor(arg0: never, ...args: never[]);
}
