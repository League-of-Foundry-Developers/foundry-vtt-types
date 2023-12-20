// FOUNDRY_VERSION: 10.291

import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * A Loader class which helps with loading video and image textures.
   */
  class TextureLoader {
    /**
     * The duration in milliseconds for which a texture will remain cached
     * @defaultValue `1000 * 60 * 15`
     */
    static CACHE_TTL: number;

    /**
     * The cached mapping of textures
     * @internal
     */
    #cache: Map<string, { tex: PIXI.BaseTexture; time: number }>;

    /**
     * Load all the textures which are required for a particular Scene
     * @param scene    - The Scene to load
     * @param options  - Additional options that configure texture loading
     *                   (default: `{}`)
     */
    static loadSceneTextures(
      scene: InstanceType<ConfiguredDocumentClassForName<"Scene">>,
      options?: Partial<TextureLoader.LoadSceneTextureOptions>,
    ): Promise<void[]>;

    /**
     * Load an Array of provided source URL paths
     * @param sources - The source URLs to load
     * @param options - Additional options which modify loading
     *                  (default: `{}`)
     * @returns A Promise which resolves once all textures are loaded
     */
    load(sources: string[], options?: Partial<TextureLoader.LoadOptions>): Promise<void[]>;

    /**
     * Load a single texture on-demand from a given source URL path
     * @param src - The source texture path to load
     * @returns The loaded texture object
     */
    loadTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * Load an image texture from a provided source url
     * @param src   - The source image URL
     * @returns     The loaded BaseTexture
     */
    loadImageTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * Load a video texture from a provided source url
     * @param src   - The source video URL
     * @returns     The loaded BaseTexture
     */
    loadVideoTexture(src: string): Promise<PIXI.BaseTexture>;

    /**
     * Use the Fetch API to retrieve a resource and return a Blob instance for it.
     * @param options  - Options to configure the loading behaviour.
     *                 (default `{}`)
     * @returns        A Blob containing the loaded data
     */
    static fetchResource(src: string, options: Partial<TextureLoader.FetchResourceOptions>): Promise<Blob>;

    /**
     * Log texture loading progress in the console and in the Scene loading bar
     * @param src       - The source URL being loaded
     * @param progress  - Loading progress
     * @internal
     */
    static #onProgress(src: string, progress: TextureLoader.Progress): void;

    /**
     * Log failed texture loading
     * @param src       - The source URL being loaded
     * @param progress  - Loading progress
     * @param error     - The error which occurred
     * @internal
     */
    static #onError(src: string, progress: TextureLoader.Progress, error: Error): void;

    /**
     * Add an image url to the texture cache
     * @param src  - The source URL
     * @param tex  - The loaded base texture
     */
    setCache(src: string, tex: PIXI.BaseTexture): void;

    /**
     * Retrieve a texture from the texture cache
     * @param src   - The source URL
     * @returns     The cached texture, or undefined
     */
    getCache(src: string): PIXI.BaseTexture | undefined;

    /**
     * Expire (and destroy) textures from the cache which have not been used for more than CACHE_TTL milliseconds.
     */
    expireCache(): void;

    /**
     * Return a URL with a cache-busting query parameter appended.
     * @param src  - The source URL being attempted
     * @returns    The new URL, or false on a failure.
     */
    static getCacheBustURL(src: string): string | false;

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
       * @defaultValue `false`
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

    interface FetchResourceOptions {
      /**
       * Append a cache-busting query parameter to the request.
       * @defaultValue `false`
       */
      bustCache: boolean;
    }
  }

  /**
   * Test whether a file source exists by performing a HEAD request against it
   * @param src  - The source URL or path to test
   * @returns    Does the file exist at the provided url?
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
   * @returns        The loaded Texture, or null if loading failed with no fallback
   */
  function loadTexture(
    src: string,
    options?: {
      /** A fallback texture to use if the requested source is unavailable or invalid */
      fallback?: string | undefined;
    },
  ): Promise<PIXI.Texture | null>;
}
