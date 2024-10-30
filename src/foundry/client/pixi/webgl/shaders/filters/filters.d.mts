import type { ConstructorOf, ValueOf, ShapeWithIndexSignature, AnyObject } from "../../../../../../types/utils.d.mts";

declare global {
  /**
   * This class defines an interface for masked custom filters
   */
  class AbstractBaseMaskFilter extends AbstractBaseFilter {
    static create(uniforms?: AbstractBaseShader.Uniforms): AbstractBaseMaskFilter;

    /**
     * The default vertex shader used by all instances of AbstractBaseMaskFilter
     */
    static vertexShader: string;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
      currentState: PIXI.FilterState,
    ): void;
  }

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

  namespace VisualEffectsMaskingFilter {
    type PostProcessModes = Array<keyof (typeof VisualEffectsMaskingFilter)["POST_PROCESS_TECHNIQUES"]>;

    type FilterMode = ValueOf<(typeof VisualEffectsMaskingFilter)["FILTER_MODES"]>;

    interface ConcreteCreateOptions {
      filterMode?: FilterMode;

      postProcessModes?: PostProcessModes;
    }
  }

  /**
   * This filter handles masking and post-processing for visual effects.
   */
  class VisualEffectsMaskingFilter extends AbstractBaseMaskFilter {
    constructor(
      vertex: string,
      fragment: string,
      uniforms: AbstractBaseShader.Uniforms,
      filterMode: VisualEffectsMaskingFilter.FilterMode,
    );

    static create<ConcreteClass extends typeof VisualEffectsMaskingFilter, T extends AnyObject>(
      this: ConcreteClass,
      {
        filterMode,
        postProcessModes,
        ...uniforms
      }?: ShapeWithIndexSignature<T, VisualEffectsMaskingFilter.ConcreteCreateOptions, string, AbstractBaseShader.UniformValue>,
    ): InstanceType<ConcreteClass>;

    /**
     * The filter mode.
     */
    filterMode: VisualEffectsMaskingFilter.FilterMode;

    /**
     * Update the filter shader with new post-process modes.
     * @param postProcessModes - New modes to apply.
     * @param uniforms         - Uniforms value to update.
     */
    updatePostprocessModes(
      postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes,
      uniforms?: AbstractBaseShader.Uniforms,
    ): void;

    /**
     * Remove all post-processing modes and reset some key uniforms.
     */
    reset(): void;

    /**
     * Masking modes.
     */
    static readonly FILTER_MODES: {
      BACKGROUND: "background";
      ILLUMINATION: "illumination";
      COLORATION: "coloration";
    };

    /**
     * @defaultValue
     * ```js
     * {
     *    replacementColor: [0, 0, 0],
     *    tint: [1, 1, 1],
     *    screenDimensions: [1, 1],
     *    enableVisionMasking: true,
     *    uVisionSampler: null,
     *    exposure: 0,
     *    contrast: 0,
     *    saturation: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Filter post-process techniques.
     */
    static readonly POST_PROCESS_TECHNIQUES: {
      EXPOSURE: { id: "EXPOSURE"; glsl: string };
      CONTRAST: { id: "CONTRAST"; glsl: string };
      SATURATION: { id: "SATURATION"; glsl: string };
    };

    /**
     * Assign the replacement color according to the filter mode.
     * @param filterMode - Filter mode.
     * @returns The replacement color.
     */
    static replacementColor(filterMode: VisualEffectsMaskingFilter.FilterMode): string;

    /**
     * Memory allocations and headers for the VisualEffectsMaskingFilter
     * @param filterMode - Filter mode.
     * @returns The filter header according to the filter mode.
     */
    static fragmentHeader(filterMode: VisualEffectsMaskingFilter.FilterMode): string;

    static fragmentCore: string;

    /**
     * Construct filter post-processing code according to provided value.
     * @param postProcessModes - Post-process modes to construct techniques.
     * @returns The constructed shader code for post-process techniques.
     */
    static fragmentPostProcess(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;

    /**
     * Specify the fragment shader to use according to mode
     * @param filterMode - (default: this.FILTER_MODES.BACKGROUND)
     * @param postProcessModes - (default: [])
     * @override
     */
    static fragmentShader(
      filterMode?: VisualEffectsMaskingFilter.FilterMode,
      postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes,
    ): string;
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
   * A filter which implements an inner or outer glow around the source texture.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/glow
   * @remarks MIT License
   */
  class GlowOverlayFilter extends AbstractBaseFilter {
    override padding: number;

    /**
     * The inner strength of the glow.
     * @defaultValue `3`
     */
    innerStrength: number;

    /**
     * The outer strength of the glow.
     * @defaultValue `3`
     */
    outerStrength: number;

    /**
     * Should this filter auto-animate?
     * @defaultValue `true`
     */
    animated: number;

    /**
     * @defaultValue
     * ```typescript
     * {
     *   distance: 10,
     *   innerStrength: 0,
     *   glowColor: [1, 1, 1, 1],
     *   quality: 0.1,
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms & { distance: number; quality: number };

    static createFragmentShader(quality: number, distance: number): string;

    static override vertexShader: string;

    static override create<T extends GlowOverlayFilter>(
      this: ConstructorOf<T>,
      uniforms: AbstractBaseShader.Uniforms,
    ): T;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
  }

  /**
   * A filter which implements an outline.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/outline
   * @remarks MIT License
   */
  class OutlineOverlayFilter extends AbstractBaseFilter {
    override padding: number;

    override autoFit: boolean;

    /**
     * If the filter is animated or not.
     * @defaultValue `true`
     */
    animate: boolean;

    /**
     * @defaultValue
     * ```js
     * {
     *    outlineColor: [1, 1, 1, 1],
     *    thickness: [1, 1],
     *    alphaThreshold: 0.60,
     *    knockout: true,
     *    wave: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    static createFragmentShader(): string;

    /**
     * The thickness of the outline.
     */
    get thickness(): number;

    set thickness(value);

    static override create<T extends OutlineOverlayFilter>(
      this: ConstructorOf<T>,
      uniforms?: AbstractBaseShader.Uniforms,
    ): T;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
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
