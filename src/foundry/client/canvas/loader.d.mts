import type { Identity, InexactPartial, NullishProps } from "#utils";
import type { TranscoderWorker } from "@pixi/basis";

/**
 * A Loader class which helps with loading video and image textures
 */
declare class TextureLoader {
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
   * Initialize the basis/ktx2 transcoder for PIXI.Assets
   * @remarks Foundry provides an `@license` attributing the `pixi-basis-ktx2` package to Kristof Van Der Haeghen.
   * The full text of the MIT license is omitted here.
   */
  static initializeBasisTranscoder(): TextureLoader.InitializeBasisTranscoderReturn;

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
   * @param resolution - Resolution of the texture data output (default: `1`)
   * @returns The texture data if the texture is valid, else undefined.
   */
  static getTextureAlphaData(texture: PIXI.Texture, resolution?: number): TextureLoader.TextureAlphaData | void;

  /**
   * Load all the textures which are required for a particular Scene
   * @param scene   - The Scene to load
   * @param options - Additional options that configure texture loading (default: `{}`)
   */
  static loadSceneTextures(
    scene: Scene.Implementation,
    options?: TextureLoader.LoadSceneTexturesOptions,
  ): Promise<void>;

  /**
   * Load an Array of provided source URL paths.
   * Paths which begin with a special character "#" are ignored as texture references
   * @param sources - The source URLs to load
   * @param options - Additional options which modify loading (default: `{}`)
   * @returns A Promise which resolves once all textures are loaded
   */
  load(sources: string[], options?: TextureLoader.LoadOptions): Promise<void>;

  /**
   * Load a single texture on-demand from a given source URL path
   * @param src - The source texture path to load
   * @returns The loaded texture object
   */
  loadTexture(src: string): Promise<TextureLoader.LoadTextureReturn>;

  /**
   * Use the Fetch API to retrieve a resource and return a Blob instance for it.
   * @param src     - The resource URL
   * @param options - Options to configure the loading behaviour.
   * @returns A Blob containing the loaded data
   * @remarks As of v13, simply forwards to {@linkcode foundry.utils.fetchResource}; Foundry comments "TODO \@deprecated in v14"
   */
  static fetchResource(src: string, options?: TextureLoader.FetchResourceOptions): Promise<Blob>;

  /**
   * Add an image or a sprite sheet url to the assets cache. Include an approximate memory size in the stored data.
   * @param src - The source URL
   * @param tex - The readied texture
   */
  setCache(src: string, asset: PIXI.BaseTexture | PIXI.Spritesheet): void;

  /**
   * Retrieve a texture or a sprite sheet from the assets cache
   * @param src - The source URL
   * @returns The cached texture, a sprite sheet or `null`
   */
  getCache(src: string): TextureLoader.LoadTextureReturn;

  /**
   * Expire and unload assets from the cache which have not been used for more than CACHE_TTL milliseconds.
   */
  expireCache(options?: TextureLoader.ExpireCacheOptions): Promise<void>;

  /**
   * Return a URL with a cache-busting query parameter appended.
   * @param src - The source URL being attempted
   * @returns The new URL, or false on a failure.
   * @remarks As of v13, simply forwards to {@linkcode foundry.utils.getCacheBustURL}; Foundry comments "TODO \@deprecated in v14"
   */
  static getCacheBustURL(src: string): string | false;

  /**
   * A public getter to expose the total approximate memory usage.
   * @returns The total usage in bytes.
   */
  static get approximateTotalMemoryUsage(): number;

  /**
   * Pin a source URL so it cannot be evicted.
   * @param src - The source URL to pin
   */
  static pinSource(src: string): void;

  /**
   * Unpin a source URL that was previously pinned.
   * @param src - The source URL to unpin
   */
  static unpinSource(src: string): void;

  /**
   * @deprecated "`TextureLoader.textureBufferDataMap` is deprecated without replacement.
   * Use {@linkcode TextureLoader.getTextureAlphaData} to create a texture data map and
   * cache it automatically, or create your own caching system" (since v12, will be removed in v14)
   */
  static get textureBufferDataMap(): Map<unknown, unknown>;

  static #TextureLoader: true;
}

declare namespace TextureLoader {
  interface Any extends AnyTextureLoader {}
  interface AnyConstructor extends Identity<typeof AnyTextureLoader> {}

  /** @remarks This is effectively [[void, void], [void, void], [void, void]] */
  type InitializeBasisTranscoderReturn = Promise<
    | [
        Awaited<ReturnType<typeof TranscoderWorker.loadTranscoder>>,
        Awaited<ReturnType<typeof PixiBasisKTX2.KTX2Parser.loadTranscoder>>,
        Awaited<ReturnType<typeof PixiBasisKTX2.BasisParser.loadTranscoder>>,
      ]
    | void
  >;

  /** @remarks Differs from {@linkcode loadTexture.Return} in that it includes `PIXI.BaseTexture` in place of `PIXI.Texture` */
  type LoadTextureReturn = PIXI.BaseTexture | PIXI.Spritesheet | null;

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
    expireCache: boolean;

    /**
     * Additional sources to load during canvas initialize
     * @defaultValue `[]`
     */
    additionalSources: string[];

    /**
     * The maximum number of textures that can be loaded concurrently
     */
    maxConcurrent: number;
  }>;

  /** Options for {@linkcode TextureLoader.loadSceneTextures}*/
  interface LoadSceneTexturesOptions extends _LoadSceneTexturesOptions {}

  /** @internal */
  type _LoadOptions = InexactPartial<{
    /**
     * The status message to display in the load bar
     * @defaultValue `""`
     */
    message: string;

    /**
     * Whether to localize the message content before displaying it
     * @defaultValue `false`
     */
    localize: boolean;

    /**
     * Whether to escape the values of `format`
     * @defaultValue `true`
     */
    escape: boolean;

    /**
     * Whether to clean the provided message string as untrusted user input.
     * No cleaning is applied if `format` is passed and `escape` is true or `localize` is true and `format` is not passed.
     * @defaultValue `true`
     */
    clean: boolean;

    /**
     * A mapping of formatting strings passed to {@linkcode foundry.helpers.Localization.format | Localization#format}
     */
    format: string;

    /**
     * Expire other cached textures?
     * @defaultValue `false`
     */
    expireCache: boolean;

    /**
     * Display loading progress bar?
     * @defaultValue `true`
     */
    displayProgress: boolean;
  }> &
    // Can't Pick `expireCache`, despite it existing on `LoadSceneTexturesOptions`, as it has a different default here
    Pick<LoadSceneTexturesOptions, "maxConcurrent">;

  /** Options for {@link TextureLoader.load | `TextureLoader#load`} */
  interface LoadOptions extends _LoadOptions {}

  /** @internal */
  type _FetchResourceOptions = NullishProps<{
    /**
     * Append a cache-busting query parameter to the request.
     * @defaultValue `false`
     */
    bustCache: boolean;
  }>;

  interface FetchResourceOptions extends _FetchResourceOptions {}

  /** @internal */
  type _ExpireCacheOptions = InexactPartial<{
    /**
     * A set of source URLs to *skip* from eviction checks.
     */
    exclude: Set<string>;
  }>;

  interface ExpireCacheOptions extends _ExpireCacheOptions {}
}

/**
 * Test whether a file source exists by performing a HEAD request against it
 * @param src - The source URL or path to test
 * @returns Does the file exist at the provided url?
 * @remarks As of v13, simply forwards to {@linkcode foundry.utils.srcExists}; Foundry comments "TODO \@deprecated in v14"
 */
export declare function srcExists(src: string): Promise<boolean>;

/**
 * Get a single texture or sprite sheet from the cache.
 * @param src - The texture path to load.
 * @returns A texture, a sprite sheet or null if not found in cache.
 */
export declare function getTexture(src: string): loadTexture.Return;

/**
 * Load a single asset and return a Promise which resolves once the asset is ready to use
 * @param src      - The requested texture source. This may be a standard texture path or a "virtual texture" beginning with
 *                   the "#" character that is retrieved from canvas.sceneTextures.
 * @param options  - Additional options which modify asset loading
 * @returns The loaded Texture or sprite sheet, or null if loading failed with no fallback
 */
declare function loadTexture(src: string, options?: loadTexture.Options): Promise<loadTexture.Return>;

declare namespace loadTexture {
  type Return = PIXI.Texture | PIXI.Spritesheet | null;

  /** @internal */
  type _Options = InexactPartial<{
    /** A fallback texture URL to use if the requested source is unavailable */
    fallback: string;
  }>;

  interface Options extends _Options {}
}

declare global {
  namespace LoadTexture {
    /** @deprecated Use {@linkcode foundry.canvas.loadTexture.Return} instead */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    export import Return = loadTexture.Return;

    /** @deprecated Use {@linkcode foundry.canvas.loadTexture.Options} instead */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    export import Options = loadTexture.Options;
  }
}

// loadTexture exported here to include namespace
export { TextureLoader as default, loadTexture };

declare abstract class AnyTextureLoader extends TextureLoader {
  constructor(...args: never);
}
