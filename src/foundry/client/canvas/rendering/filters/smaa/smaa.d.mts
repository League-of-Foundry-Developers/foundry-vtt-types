import type { Brand, Identity, InexactPartial } from "#utils";

/**
 * The SMAA filter.
 * @see {@link foundry.canvas.rendering.filters.SMAAEdgeDetectionFilter}
 * @see {@link foundry.canvas.rendering.filters.SMAABlendingWeightCalculationFilter}
 * @see {@link foundry.canvas.rendering.filters.SMAANeighborhoodBlendingFilter}
 */
declare class SMAAFilter extends PIXI.Filter {
  /**
   * @param config - The config
   * @remarks The one place Foundry makes one of these it passes no config
   * @privateRemarks Foundry references `SMAAFilter.PRESETS.DEFAULT` as the default values for `config`,
   * but that key does not exist in 12.331 or 11.315, and appears to just be a docs error.
   */
  // config: not null (destructured)
  constructor(config?: SMAAFilter.ConstructorOptions);

  /**
   * The presets.
   * @remarks Unused as of 13.344
   */
  static get PRESETS(): SMAAFilter.Presets;

  override apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clearMode: PIXI.CLEAR_MODES | undefined,
    currentState: PIXI.FilterState,
  ): void;

  #SMAAFilter: true;
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
     * @remarks Can't be `null` as it only has a parameter default
     */
    threshold: number;

    /**
     * If there is an neighbor edge that has SMAA_LOCAL_CONTRAST_FACTOR times bigger contrast than current
     * edge, current edge will be discarded. This allows to eliminate spurious crossing edges, and is based
     * on the fact that, if there is too much contrast in a direction, that will hide perceptually contrast
     * in the other neighbors.
     * @defaultValue `2.0`
     * @remarks Can't be `null` as it only has a parameter default
     */
    localContrastAdaptionFactor: number;

    /**
     * Specifies the maximum steps performed in the horizontal/vertical pattern searches, at each side of the
     * pixel. In number of pixels, it's actually the double. So the maximum line length perfectly handled by,
     * for example 16, is 64 (by perfectly, we meant that longer lines won't look as good, but still antialiased).
     *
     * Range: [0, 112].
     * @defaultValue `16`
     * @remarks Can't be `null` as it only has a parameter default
     */
    maxSearchSteps: number;

    /**
     * Specifies the maximum steps performed in the diagonal pattern searches, at each side of the pixel. In this
     * case we jump one pixel at time, instead of two.
     *
     * Range: [0, 20].
     * @defaultValue `8`
     * @remarks Can't be `null` as it only has a parameter default
     */
    maxSearchStepsDiag: number;

    /**
     * Specifies how much sharp corners will be rounded.
     *
     * Range: [0, 100].
     * @defaultValue `25`
     * @remarks Can't be `null` as it only has a parameter default
     */
    cornerRounding: number;

    /**
     * Is diagonal detection disabled?
     * @defaultValue `false`
     * @remarks Can't be `null` as it only has a parameter default
     */
    disableDiagDetection: boolean;

    /**
     * Is corner detection disabled?
     * @defaultValue `false`
     * @remarks Can't be `null` as it only has a parameter default
     */
    disableCornerDetection: boolean;
  }

  interface ConstructorOptions extends InexactPartial<Config> {}
}

export default SMAAFilter;

declare abstract class AnySMAAFilter extends SMAAFilter {
  constructor(...args: never);
}
