import type { ConfiguredDocumentClassForName } from '../../types/helperTypes';

declare global {
  /**
   * A Loader class which helps with loading video and image textures
   */
  class TextureLoader {
    /**
     * The cached mapping of textures
     */
    cache: Map<string, { tex: PIXI.Texture; time: number }>;

    /**
     * The duration in milliseconds for which a texture will remain cached
     * @defaultValue `1000`
     */
    static CACHE_TTL: number;

    /**
     * Load all the textures which are required for a particular Scene
     * @param scene   - The Scene to load
     * @param options - Additional options that configure texture loading
     *                  (default: `{}`)
     */
    static loadSceneTextures(
      scene: InstanceType<ConfiguredDocumentClassForName<'Scene'>>,
      options?: Partial<TextureLoader.LoadSceneTextureOptions>
    ): Promise<void[]>;

    /**
     * Load an Array of provided source URL paths
     * @param sources - The source URLs to load
     * @param options - Additional options which modify loading
     * @returns A Promise which resolves once all textures are loaded
     */
    load(sources: string[], options?: Partial<TextureLoader.LoadOptions>): Promise<void[]>;

    /**
     * Load a single texture on-demand from a given source URL path
     * @param src - The source texture path to load
     * @returns The loaded texture object
     */
    loadTexture(src: string): Promise<PIXI.Texture>;

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
    loadImageTexture(src: string): Promise<PIXI.Texture>;

    /**
     * If an attempted image load failed, we may attempt a re-load in case the issue was CORS + caching
     * Cross-origin requests which failed might be CORS, or might be 404, no way to know - so try a 2nd time
     * @param src     - The source URL being attempted
     * @param resolve - Resolve the promise
     * @param reject  - Reject the promise
     * @internal
     */
    protected _attemptCORSReload<T>(
      src: string,
      resolve: (tex: PIXI.Texture) => void,
      reject: (reason: string) => T
    ): Promise<PIXI.Texture | T>;

    /**
     * Load a video texture from a provided source url
     * @param src -
     */
    loadVideoTexture(src: string): Promise<PIXI.Texture>;

    /**
     * Add an image url to the texture cache
     * @param src - The source URL
     * @param tex - The readied texture
     */
    setCache(src: string, tex: PIXI.Texture): void;

    /**
     * Retrieve a texture from the texture cache
     * @param src - The source URL
     */
    getCache(src: string): PIXI.Texture | undefined;

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
}
