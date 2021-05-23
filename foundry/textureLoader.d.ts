/**
 * A Loader class which helps with loading video and image textures
 */
declare class TextureLoader {
  /**
   * A global reference to the singleton texture loader
   */
  static loader: TextureLoader;

  /**
   * Load all the textures which are required for a particular Scene
   * @param scene - The Scene to load
   */
  static loadSceneTextures(scene: Scene): Promise<void>;

  constructor();

  cache: Map<string, PIXI.Texture>;

  /**
   * Retrieve a texture from the texture cache
   * @param src - The source URL
   */
  getCache(src: string): PIXI.Texture | undefined;

  /**
   * Load an Array of provided source URL paths
   * @param sources - The source URLs to load
   * @param message - The status message to display in the load bar
   * @returns A Promise which resolves once all textures are loaded
   */
  load(sources: string[], { message }?: { message?: string }): Promise<void>;

  /**
   * Load an image texture from a provided source url
   * @param src -
   */
  loadImageTexture(src: string): Promise<PIXI.Texture>;

  /**
   * Load a single texture on-demand from a given source URL path
   * @param src -
   */
  loadTexture(src: string): Promise<PIXI.Texture>;

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
   * Log failed texture loading
   */
  protected _onError(src: string, progress: TextureLoader.Progress, error: Error): void;

  /**
   * Log texture loading progress in the console and in the Scene loading bar
   */
  protected _onProgress(src: string, progress: TextureLoader.Progress, message: string): void;
}

declare namespace TextureLoader {
  interface Progress {
    failed: number;
    loaded: number;
    message: string;
    pct: number;
    total: number;
  }
}
