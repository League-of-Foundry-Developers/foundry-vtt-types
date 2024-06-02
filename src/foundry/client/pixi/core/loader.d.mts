export {};

declare global {
  /**
   * A Loader class which helps with loading video and image textures
   */
  class TextureLoader {
    /**
     * The duration in milliseconds for which a texture will remain cached
     * @defaultValue `1000 * 60 * 15`
     */
    static CACHE_TTL: number;

    /**
     * A mapping of url to cached texture buffer data
     */
    static textureBufferDataMap: Map<string, object>;

    /**
     * Check if a source has a text file extension.
     * @param src - The source.
     * @returns If the source has a text extension or not.
     */
    static hasTextExtension(src: string): boolean;

    /**
     * Load all the textures which are required for a particular Scene
     * @param scene   - The Scene to load
     * @param options - Additional options that configure texture loading
     *                  (default: `{}`)
     */
    static loadSceneTextures(
      scene: Scene.ConfiguredInstance,
      options?: Partial<TextureLoader.LoadSceneTextureOptions>,
    ): Promise<void[]>;

    /**
     * Load an Array of provided source URL paths
     * @param sources - The source URLs to load
     * @param options - Additional options which modify loading
     *                  (default: `{}`)
     * @returns A Promise which resolves once all textures are loaded
     */
    load(sources: string[], options?: Partial<TextureLoader.LoadOptions>): Promise<PIXI.BaseTexture | void[]>;

    /**
     * Load a single texture on-demand from a given source URL path
     * @param src - The source texture path to load
     * @returns The loaded texture object
     */
    loadTexture(src: string): Promise<PIXI.BaseTexture | PIXI.Spritesheet | null>;

    /**
     * Log texture loading progress in the console and in the Scene loading bar
     * @internal
     */
    protected _onProgress(src: string, progress: TextureLoader.Progress): void;

    /**
     * Log failed texture loading
     * @internal
     */
    protected _onError(src: string, progress: TextureLoader.Progress, error: Error): void;

    /**
     * Use the Fetch API to retrieve a resource and return a Blob instance for it.
     * @param options - Options to configure the loading behaviour.
     *                  (default: `{}`)
     * @internal
     */
    protected _fetchResource(
      src: string,
      options?: {
        /**
         * Append a cache-busting query parameter to the request.
         * @defaultValue `false`
         */
        bustCache?: boolean | undefined;
      },
    ): Promise<Blob>;

    /**
     * Return a URL with a cache-busting query parameter appended.
     * @param src - The source URL being attempted
     * @returns The new URL, or false on a failure.
     * @internal
     */
    protected _getCacheBustURL(src: string): string | false;

    /**
     * Add an image or a sprite sheet url to the assets cache.
     * @param src - The source URL
     * @param tex - The readied texture
     */
    setCache(src: string, tex: PIXI.BaseTexture | PIXI.Spritesheet): void;

    /**
     * Retrieve a texture or a sprite sheet from the assets cache
     * @param src - The source URL
     */
    getCache(src: string): PIXI.BaseTexture | PIXI.Spritesheet | null;

    /**
     * Expire and unload assets from the cache which have not been used for more than CACHE_TTL milliseconds.
     */
    expireCache(): void;
    /**
     * Return a URL with a cache-busting query parameter appended.
     * @param src - The source URL being attempted
     * @returns The new URL, or false on a failure.
     */
    static getCacheBustURL(src: string): string | boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks TextureLoader#loadImageTexture is deprecated. Use TextureLoader#loadTexture instead.
     */
    loadImageTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks TextureLoader#loadVideoTexture is deprecated. Use TextureLoader#loadTexture instead.
     */
    loadVideoTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * A global reference to the singleton texture loader
     */
    static loader: TextureLoader;
  }

  namespace TextureLoader {
    interface LoadSceneTextureOptions {
      /**
       * Destroy other expired textures
       * @defaultValue `true`
       */
      expireCache?: boolean;

      /**
       * Additional sources to load during canvas initialize
       * @defaultValue `[]`
       */
      additionalSource?: Array<boolean>;

      /**
       * The maximum number of textures that can be loaded concurrently
       */
      maxConcurrent?: number;
    }

    interface LoadOptions {
      /**
       * The status message to display in the load bar
       */
      message?: string | undefined;

      /**
       * Expire other cached textures?
       * @defaultValue `true`
       */
      expireCache?: boolean;

      /**
       * The maximum number of textures that can be loaded concurrently
       */
      maxConcurrent?: number;
    }

    interface Progress {
      message: string;
      loaded: number;
      failed: number;
      total: number;
      pct: number;
    }
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
  function getTexture(src: string): PIXI.Texture | null;

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
