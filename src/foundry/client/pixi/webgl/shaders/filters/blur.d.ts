export {};

declare global {
  /**
   * Apply a vertical or horizontal gaussian blur going inward by using alpha as the penetrating channel.
   */
  class AlphaBlurFilterPass extends PIXI.Filter {
    /**
     * @param horizontal - If the pass is horizontal (true) or vertical (false).
     * @param strength   - Strength of the blur (distance of sampling).
     *                     (default: 8)
     * @param quality    - Number of passes to generate the blur. More passes = Higher quality = Lower Perf.
     *                     (default: 4)
     * @param resolution - Resolution of the filter.
     *                     (default: PIXI.Filter.defaultResolution)
     * @param kernelSize - Number of kernels to use. More kernels = Higher quality = Lower Perf.
     *                     (default: 5)
     */
    constructor(horizontal: boolean, strength?: number, quality?: number, resolution?: number, kernelSize?: number);
  }

  /**
   * Apply a gaussian blur going inward by using alpha as the penetrating channel.
   */
  class AlphaBlurFilter extends PIXI.Filter {
    /**
     *
     * @param horizontal - If the pass is horizontal (true) or vertical (false).
     * @param strength   - Strength of the blur (distance of sampling).
     *                     (default: 8)
     * @param quality    - Number of passes to generate the blur. More passes = Higher quality = Lower Perf.
     *                     (default: 4)
     * @param resolution - Resolution of the filter.
     *                     (default: PIXI.Filter.defaultResolution)
     * @param kernelSize - Number of kernels to use. More kernels = Higher quality = Lower Perf.
     *                     (default: 5)
     */
    constructor(strength?: number, quality?: number, resolution?: number, kernelSize?: number);
  }
}
