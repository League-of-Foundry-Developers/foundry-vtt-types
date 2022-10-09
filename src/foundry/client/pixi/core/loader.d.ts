import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * A Loader class which helps with loading video and image textures
   */
  class TextureLoader {
    /**
     * The cached mapping of textures
     */
    cache: Map<string, { tex: PIXI.BaseTexture; time: number }>;

    /**
     * The duration in milliseconds for which a texture will remain cached
     * @defaultValue `1000 * 60 * 15`
     */
    static CACHE_TTL: number;

    /**
     * Load all the textures which are required for a particular Scene
     * @param scene   - The Scene to load
     * @param options - Additional options that configure texture loading
     *                  (default: `{}`)
     */
    static loadSceneTextures(
      scene: InstanceType<ConfiguredDocumentClassForName<"Scene">>,
      options?: Partial<TextureLoader.LoadSceneTextureOptions>
    ): Promise<void[]>;

    /**
     * Load an Array of provided source URL paths
     * @param sources - The source URLs to load
     * @param options - Additional options which modify loading
     * @returns A Promise which resolves once all textures are loaded
     */
    load(sources: string[], options?: Partial<TextureLoader.LoadOptions>): Promise<PIXI.BaseTexture | void[]>;

    /**
     * Load a single texture on-demand from a given source URL path
     * @param src - The source texture path to load
     * @returns The loaded texture object
     */
    loadTexture(src: string): Promise<PIXI.BaseTexture>;

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
     * Load an image texture from a provided source url
     */
    loadImageTexture(src: string): Promise<PIXI.BaseTexture>;

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
      }
    ): Promise<Blob>;

    /**
     * Return a URL with a cache-busting query parameter appended.
     * @param src - The source URL being attempted
     * @returns The new URL, or false on a failure.
     * @internal
     */
    protected _getCacheBustURL(src: string): string | false;

    /**
     * Load a video texture from a provided source url
     */
    loadVideoTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * Add an image url to the texture cache
     * @param src - The source URL
     * @param tex - The readied texture
     */
    setCache(src: string, tex: PIXI.BaseTexture): void;

    /**
     * Retrieve a texture from the texture cache
     * @param src - The source URL
     */
    getCache(src: string): PIXI.BaseTexture | undefined;

    /**
     * Expire (and destroy) textures from the cache which have not been used for more than CACHE_TTL milliseconds.
     */
    expireCache(): void;

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
      expireCache: boolean;
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
      expireCache: boolean;
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
   * Get a single texture from the cache
   */
  function getTexture(src: string): PIXI.Texture | null;

  /**
   * Load a single texture and return a Promise which resolves once the texture is ready to use
   * @param src      - The requested texture source
   * @param options  - Additional options which modify texture loading
   */
  function loadTexture(
    src: string,
    options?: {
      /** A fallback texture to use if the requested source is unavailable or invalid */
      fallback?: string | undefined;
    }
  ): Promise<PIXI.Texture | null>;
}
