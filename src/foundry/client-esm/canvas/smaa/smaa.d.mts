import type { CLEAR_MODES, FilterState, FilterSystem, RenderTexture } from "pixi.js";

import type { InexactPartial } from "../../../../types/utils.d.mts";
import type SMAAEdgeDetectionFilter from "./edges.mts";
import type SMAANeighborhoodBlendingFilter from "./blend.mts";
import type SMAABlendingWeightCalculationFilter from "./weights.mts";

declare class SMAAFilter extends PIXI.Filter {
  /**
   * @param [config]    The config (defaults: {@link SMAAFilter.PRESETS.DEFAULT})
   */
  constructor(config?: InexactPartial<SMAAFilter.SMAAFilterConfig>);

  /**
   * The presets.
   * @enum {SMAAFilterConfig}
   */
  static get PRESETS(): Record<string, SMAAFilter.SMAAFilterConfig>;
  static #PRESETS: Record<string, SMAAFilter.SMAAFilterConfig>;

  /**
   * The edge detection filter.
   */
  #edgesFilter: SMAAEdgeDetectionFilter;

  /**
   * The blending weight calculation filter.
   */
  #weightsFilter: SMAABlendingWeightCalculationFilter;

  /**
   * The neighborhood blending filter.
   */
  #blendFilter: SMAANeighborhoodBlendingFilter;

  /** @override */
  apply(
    filterManager: FilterSystem,
    input: RenderTexture,
    output: RenderTexture,
    clearMode: CLEAR_MODES | undefined,
    currentState: FilterState,
  ): void;
}

declare namespace SMAAFilter {
  /**
   * @typedef {object} SMAAFilterConfig
   * @property threshold                    - Specifies the threshold or sensitivity to edges. Lowering this value you will be able to detect more edges at the expense of performance. Range: [0, 0.5]. 0.1 is a reasonable value, and allows to catch most visible edges. 0.05 is a rather overkill value, that allows to catch 'em all.
   * @property localContrastAdaptionFactor  - If there is an neighbor edge that has SMAA_LOCAL_CONTRAST_FACTOR times bigger contrast than current edge, current edge will be discarded.
   *                                           This allows to eliminate spurious crossing edges, and is based on the fact that, if there is too much contrast in a direction, that will hide perceptually contrast in the other neighbors.
   * @property maxSearchSteps               - Specifies the maximum steps performed in the horizontal/vertical pattern searches, at each side of the pixel. In number of pixels, it's actually the double. So the maximum line length perfectly handled by, for example 16, is 64 (by perfectly, we meant that longer lines won't look as good, but still antialiased. Range: [0, 112].
   * @property maxSearchStepsDiag           - Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel. In this case we jump one pixel at time, instead of two. Range: [0, 20].
   * @property cornerRounding               - Specifies how much sharp corners will be rounded. Range: [0, 100].
   * @property disableDiagDetection         - Is diagonal detection disabled?
   * @property disableCornerDetection       - Is corner detection disabled?
   */
  interface SMAAFilterConfig {
    threshold: number;
    localContrastAdaptionFactor: number;
    maxSearchSteps: number;
    maxSearchStepsDiag: number;
    cornerRounding: number;
    disableDiagDetection: boolean;
    disableCornerDetection: boolean;
  }
}

export default SMAAFilter;
