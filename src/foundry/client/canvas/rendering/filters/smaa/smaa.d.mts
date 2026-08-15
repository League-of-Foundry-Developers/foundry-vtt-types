import type { Brand, Identity, InexactPartial } from "#utils";

/**
 * The SMAA filter.
 * @see {@linkcode foundry.canvas.rendering.filters.SMAAEdgeDetectionFilter}
 * @see {@linkcode foundry.canvas.rendering.filters.SMAABlendingWeightCalculationFilter}
 * @see {@linkcode foundry.canvas.rendering.filters.SMAANeighborhoodBlendingFilter}
 */
declare class SMAAFilter extends PIXI.Filter {
  /**
   * @param config - The configuration options.
   */
  constructor(config?: SMAAFilter.ConstructorOptions);

  /**
   * The presets.
   * @remarks Not used by Foundry's 14.365
   */
  static get PRESETS(): SMAAFilter.Presets;

  override apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clearMode?: PIXI.CLEAR_MODES,
    currentState?: PIXI.FilterState,
  ): void;

  #SMAAFilter: true;
  static #SMAAFilterStatic: true;
}

declare namespace SMAAFilter {
  interface Any extends AnySMAAFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAAFilter> {}

  type PRESETS = Brand<Config, "SMAAFilter.PRESETS">;

  /**
   * @privateRemarks This is frozen with {@linkcode foundry.utils.deepFreeze} and is
   * only exposed as a getter for a private property, it's truly inextensible
   */
  type Presets = Readonly<{
    LOW: Readonly<{
      threshold: 0.15;
      localContrastAdaptionFactor: 2.0;
      maxSearchSteps: 4;
      maxSearchStepsDiag: 0;
      cornerRounding: 0;
      disableDiagDetection: true;
      disableCornerDetection: true;
    }> &
      PRESETS;
    MEDIUM: Readonly<{
      threshold: 0.1;
      localContrastAdaptionFactor: 2.0;
      maxSearchSteps: 8;
      maxSearchStepsDiag: 0;
      cornerRounding: 0;
      disableDiagDetection: true;
      disableCornerDetection: true;
    }> &
      PRESETS;
    HIGH: Readonly<{
      threshold: 0.1;
      localContrastAdaptionFactor: 2.0;
      maxSearchSteps: 16;
      maxSearchStepsDiag: 8;
      cornerRounding: 25;
      disableDiagDetection: false;
      disableCornerDetection: false;
    }> &
      PRESETS;
    ULTRA: Readonly<{
      threshold: 0.05;
      localContrastAdaptionFactor: 2.0;
      maxSearchSteps: 32;
      maxSearchStepsDiag: 16;
      cornerRounding: 25;
      disableDiagDetection: false;
      disableCornerDetection: false;
    }> &
      PRESETS;
  }>;

  interface Config {
    /**
     * Specifies the threshold or sensitivity to edges. Lowering this value you will be able to detect more
     * edges at the expense of performance.
     *
     * Range: [0, 0.5].
     *
     * 0.1 is a reasonable value, and allows to catch
     * most visible edges. 0.05 is a rather overkill value, that allows to catch 'em all.
     * @defaultValue `0.1`
     */
    threshold: number;

    /**
     * If there is an neighbor edge that has SMAA_LOCAL_CONTRAST_FACTOR times bigger contrast than current
     * edge, current edge will be discarded. This allows to eliminate spurious crossing edges, and is based
     * on the fact that, if there is too much contrast in a direction, that will hide perceptually contrast
     * in the other neighbors.
     * @defaultValue `2.0`
     */
    localContrastAdaptionFactor: number;

    /**
     * Specifies the maximum steps performed in the horizontal/vertical pattern searches, at each side of the
     * pixel. In number of pixels, it's actually the double. So the maximum line length perfectly handled by,
     * for example 16, is 64 (by perfectly, we meant that longer lines won't look as good, but still antialiased).
     *
     * Range: [0, 112].
     * @defaultValue `16`
     */
    maxSearchSteps: number;

    /**
     * Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel. In this
     * case we jump one pixel at time, instead of two.
     *
     * Range: [0, 20].
     * @defaultValue `8`
     */
    maxSearchStepsDiag: number;

    /**
     * Specifies how much sharp corners will be rounded.
     *
     * Range: [0, 100].
     * @defaultValue `25`
     */
    cornerRounding: number;

    /**
     * Is diagonal detection disabled?
     * @defaultValue `false`
     */
    disableDiagDetection: boolean;

    /**
     * Is corner detection disabled?
     * @defaultValue `false`
     */
    disableCornerDetection: boolean;
  }

  interface ConstructorOptions extends InexactPartial<Config> {}
}

export default SMAAFilter;

declare abstract class AnySMAAFilter extends SMAAFilter {
  constructor(...args: never);
}
