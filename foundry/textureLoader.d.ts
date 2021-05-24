/**
 * A Loader class which helps with loading video and image textures
 */
declare class TextureLoader {
  constructor();

  cache: Map<string, PIXI.Texture>;

  /**
   * Load all the textures which are required for a particular Scene
   * @param scene - The Scene to load
   */
  static loadSceneTextures(scene: Scene): Promise<void>;

  /**
   * Load an Array of provided source URL paths
   * @param sources - The source URLs to load
   * @param message - The status message to display in the load bar
   * @returns A Promise which resolves once all textures are loaded
   */
  load(sources: string[], { message }?: { message?: string }): Promise<void>;

  /**
   * Load a single texture on-demand from a given source URL path
   * @param src -
   */
  loadTexture(src: string): Promise<PIXI.Texture>;

  /**
   * Log texture loading progress in the console and in the Scene loading bar
   */
  protected _onProgress(src: string, progress: TextureLoader.Progress, message: string): void;

  /**
   * Log failed texture loading
   */
  protected _onError(src: string, progress: TextureLoader.Progress, error: Error): void;

  /**
   * Load an image texture from a provided source url
   * @param src -
   */
  loadImageTexture(src: string): Promise<PIXI.Texture>;

  /**
   * If an attempted image load failed, we may attempt a re-load in case the issue was CORS + caching
   * Cross-origin requests which failed might be CORS, or might be 404, no way to know - so try a 2nd time
   * @param src     - The source URL being attempted
   * @param resolve - Resolve the promise
   * @param reject  - Reject the promise
   */
  protected _attemptCORSReload<T>(
    src: string,
    resolve: (texture: PIXI.Texture) => void,
    reject: () => T
  ): Promise<PIXI.Texture> | T;

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
   * A global reference to the singleton texture loader
   */
  static loader: TextureLoader;
}

declare namespace TextureLoader {
  interface Progress {
    message: string;
    loaded: number;
    failed: number;
    total: number;
    pct: number;
  }
}
