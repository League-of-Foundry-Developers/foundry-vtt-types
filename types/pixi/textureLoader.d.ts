/**
 * Load a single texture and return a Promise which resolves once the texture is ready to use
 * @param src - The requested texture source
 * @param options - (default: `{}`)
 * @param fallback - A fallback texture to use if the requested source is unavailable or invalid
 *                   (default: `null`)
 */
declare function loadTexture (
  src: string,
  { fallback }?: {
    /**
     * @param fallback - A fallback texture to use if the requested source is unavailable or invalid
     *                   (default: `null`)
     */
    fallback?: string
  }
): Promise<PIXI.Texture>
