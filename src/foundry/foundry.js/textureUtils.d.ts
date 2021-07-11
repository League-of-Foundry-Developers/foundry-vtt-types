/**
 * Test whether a file source exists by performing a HEAD request against it
 * @param src - The source URL or path to test
 * @returns Does the file exist at the provided url?
 */
declare function srcExists(src: string): Promise<boolean>;

/**
 * Get a single texture from the cache
 */
declare function getTexture(src: string): PIXI.Texture | null;

/**
 * Load a single texture and return a Promise which resolves once the texture is ready to use
 * @param src      - The requested texture source
 * @param fallback - A fallback texture to use if the requested source is unavailable or invalid
 *                   (default: `undefined`)
 */
declare function loadTexture(
  src: string,
  {
    fallback
  }?: {
    /**
     * A fallback texture to use if the requested source is unavailable or invalid
     * @defaultValue `undefined`
     */
    fallback?: string;
  }
): Promise<PIXI.Texture>;
