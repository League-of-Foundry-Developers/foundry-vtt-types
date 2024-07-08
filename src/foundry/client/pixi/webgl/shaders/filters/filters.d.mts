import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

declare global {
  /**
   * A filter used to control channels intensity using an externally provided mask texture.
   * The mask channel used must be provided at filter creation.
   * Contributed by SecretFire#4843
   */
  class InverseOcclusionMaskFilter extends AbstractBaseMaskFilter {
    static create<T extends InverseOcclusionMaskFilter>(
      this: ConstructorOf<T>,
      uniforms?: AbstractBaseShader.Uniforms,
    ): T;

    static adaptiveFragmentShader(channel: "r" | "g" | "b"): string;

    /**
     * @defaultValue
     * ```js
     * {
     *  uMaskSampler: null,
     *  alphaOcclusion: 0,
     *  alpha: 1,
     *  depthElevation: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * A filter used to apply a reverse mask on the target display object.
   * The caller must choose a channel to use (alpha is a good candidate).
   */
  class ReverseMaskFilter extends AdaptiveFragmentChannelMixin(AbstractBaseMaskFilter) {
    static override adaptiveFragmentShader(channel: "r" | "g" | "b"): string;

    /**
     * @defaultValue
     * ```js
     * { uMaskSampler: null }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * A minimalist filter (just used for blending)
   */
  class VoidFilter extends AbstractBaseFilter {
    static create<T extends VoidFilter>(this: ConstructorOf<T>, uniforms?: AbstractBaseShader.Uniforms): T;

    static override fragmentShader: string;
  }

  /**
   * Apply visibility coloration according to the baseLine color.
   * Uses very lightweight gaussian vertical and horizontal blur filter passes.
   */
  class VisibilityFilter extends AbstractBaseMaskFilter {
    constructor(...args: ConstructorParameters<typeof AbstractBaseMaskFilter>);

    /**
     * @defaultValue
     * ```js
     * {
     *    exploredColor: [1, 1, 1],
     *    unexploredColor: [0, 0, 0],
     *    screenDimensions: [1, 1],
     *    visionTexture: null,
     *    primaryTexture: null,
     *    overlayTexture: null,
     *    overlayMatrix: new PIXI.Matrix(),
     *    hasOverlayTexture: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create(
      uniforms?: AbstractBaseShader.Uniforms,
      options?: Parameters<(typeof VisibilityFilter)["fragmentShader"]>,
    ): VisibilityFilter;

    static override vertexShader: string;

    static override fragmentShader(options: { persistentVision: boolean }): string;

    /**
     * Set the blur strength
     * @param value - blur strength
     */
    set blur(value: number);

    get blur();

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;

    /**
     * Calculate the fog overlay sprite matrix.
     */
    calculateMatrix(filterManager: PIXI.FilterSystem): void;
  }

  /**
   * A filter which forces all non-transparent pixels to a specific color and transparency.
   */
  class ForceColorFilter extends AbstractBaseFilter {
    static create<T extends ForceColorFilter>(this: ConstructorOf<T>, uniforms?: AbstractBaseShader.Uniforms): T;

    /**
     * @defaultValue
     * ```js
     * {
     *   color: [1, 1, 1],
     *   alpha: 1.0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override fragmentShader: string;
  }

  /**
   * This filter turns pixels with an alpha channel &lt; alphaThreshold in transparent pixels
   * Then, optionally, it can turn the result in the chosen color (default: pure white).
   * The alpha [threshold,1] is re-mapped to [0,1] with an hermite interpolation slope to prevent pixelation.
   */
  class RoofMaskFilter extends AbstractBaseFilter {
    static create<T extends RoofMaskFilter>(this: ConstructorOf<T>, uniforms?: AbstractBaseShader.Uniforms): T;

    /**
     * @defaultValue
     * ```js
     * {
     *   alphaThreshold: 0.75,
     *   turnToColor: false,
     *   color: [1, 1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override fragmentShader: string;
  }

  /**
   * The filter used by the weather layer to mask weather above occluded roofs.
   * @see {@link WeatherEffects}
   */
  class WeatherOcclusionMaskFilter extends AbstractBaseMaskFilter {
    /**
     * Elevation of this weather occlusion mask filter.
     * @defaultValue `Infinity`
     */
    elevation: number;

    static override vertexShader: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    depthElevation: 0,
     *    useOcclusion: true,
     *    occlusionTexture: null,
     *    reverseOcclusion: false,
     *    occlusionWeights: [0, 0, 1, 0],
     *    useTerrain: false,
     *    terrainTexture: null,
     *    reverseTerrain: false,
     *    terrainWeights: [1, 0, 0, 0],
     *    sceneDimensions: [0, 0],
     *    sceneAnchor: [0, 0]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
  }
}
