import type { Identity, IntentionalPartial, NullishProps } from "fvtt-types/utils";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

/**
 * A specialized subclass of BaseEffectSource which deals with the rendering of light or darkness.
 */
declare abstract class BaseLightSource<
  SourceData extends BaseLightSource.SourceData = BaseLightSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = RenderedEffectSource.Layers,
> extends RenderedEffectSource<SourceData, SourceShape, RenderingLayers> {
  /** @defaultValue `"light"` */
  static override sourceType: string;

  /** @defaultValue `["animation.type", "walls"]` */
  protected static override _initializeShaderKeys: string[];

  /** @defaultValue `["dim", "bright", "attenuation", "alpha", "coloration", "color", "contrast", "saturation", "shadows", "luminosity"]` */
  protected static override _refreshUniformsKeys: string[];

  /**
   * The corresponding lighting levels for dim light.
   * @defaultValue `foundry.CONST.LIGHTING_LEVELS.DIM`
   */
  protected static _dimLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /**
   * The corresponding lighting levels for bright light.
   * @defaultValue `foundry.CONST.LIGHTING_LEVELS.BRIGHT`
   */
  protected static _brightLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /**
   * The corresponding animation config.
   * @privateRemarks Only uses {@link CONFIG.Canvas.lightAnimations | `CONFIG.Canvas.lightAnimations`} in
   * {@link foundry.canvas.sources.BaseLightSource | `foundry.canvas.sources.BaseLightSource`}, but
   * {@link foundry.canvas.sources.PointDarknessSource | `foundry.canvas.sources.PointDarknessSource`}
   * overrides to use `.darknessAnimations`, so the union type is necessary
   */
  protected static get ANIMATIONS(): typeof CONFIG.Canvas.lightAnimations | typeof CONFIG.Canvas.darknessAnimations;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   priority: 0,
   *   alpha: 0.5,
   *   bright: 0,
   *   coloration: 1,
   *   contrast: 0,
   *   dim: 0,
   *   attenuation: 0.5,
   *   luminosity: 0.5,
   *   saturation: 0,
   *   shadows: 0,
   *   vision: false
   * }
   * ```
   */
  static override defaultData: BaseLightSource.SourceData;

  /**
   * A ratio of dim:bright as part of the source radius
   */
  ratio: number;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _updateColorationUniforms(): void;

  protected override _updateIlluminationUniforms(): void;

  protected override _updateBackgroundUniforms(): void;

  protected override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /** @remarks Doesn't exist prior to initialization. Ultimately set in `_updateCommonUniforms` */
  cachedAttenuation?: number;

  /** @remarks Doesn't exist prior to initialization. Ultimately set in `_updateCommonUniforms` */
  computedAttenuation?: number;

  /**
   * An animation with flickering ratio and light intensity.
   * @param dt      - Delta time
   * @param options - Additional options which modify the torch animation
   */
  // not null (destructured)
  animateTorch(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * An animation with flickering ratio and light intensity
   * @param dt      - Delta time
   * @param options - Additional options which modify the flame animation
   */
  // not null (destructured)
  animateFlickering(dt: number, options?: BaseLightSource.AnimateFlickeringOptions): void;

  /**
   * @remarks This property will be generated on any class that is `#animateFlickering`'s `this` when it is called.
   * In Foundry practice this will always be a `BaseLightSource` subclass, so it's defined here. Foundry does not
   * document it.
   */
  _noise?: SmoothNoise;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt      - Delta time
   * @param options - Additional options which modify the pulse animation
   */
  // not null (destructured)
  animatePulse(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * @deprecated since v12, until v14
   * @remarks "BaseLightSource#isDarkness is now obsolete. Use DarknessSource instead."
   *
   * Always returns `false`
   */
  get isDarkness(): boolean;
}

declare namespace BaseLightSource {
  interface Any extends AnyBaseLightSource {}
  interface AnyConstructor extends Identity<typeof AnyBaseLightSource> {}

  type LightAnimationFunction = (
    this: BaseLightSource,
    dt: number,
    options?: RenderedEffectSource.AnimationFunctionOptions,
  ) => void;

  interface SourceData extends RenderedEffectSource.SourceData {
    /**
     * An opacity for the emitted light, if any
     * @defaultValue `0.5`
     */
    alpha: number;

    /**
     * The allowed radius of bright vision or illumination
     * @defaultValue `0`
     */
    bright: number;

    /**
     * The coloration technique applied in the shader
     * @defaultValue `1`
     */
    coloration: number;

    /**
     * The amount of contrast this light applies to the background texture
     * @defaultValue `0`
     */
    contrast: number;

    /**
     * The allowed radius of dim vision or illumination
     * @defaultValue `0`
     */
    dim: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     * @defaultValue `0.5`
     */
    attenuation: number;

    /**
     * The luminosity applied in the shader
     * @defaultValue `0.5`
     */
    luminosity: number;

    /**
     * The amount of color saturation this light applies to the background texture
     * @defaultValue `0`
     */
    saturation: number;

    /**
     * The depth of shadows this light applies to the background texture
     * @defaultValue `0`
     */
    shadows: number;

    /**
     * Whether or not this source provides a source of vision
     * @defaultValue `false`
     */
    vision: boolean;

    /**
     * Strength of this source to beat or not negative/positive sources
     * @defaultValue `0`
     */
    priority: number;
  }

  /** @internal */
  type _AnimateFlickeringOptions = NullishProps<{
    /**
     * Noise amplification (\>1) or dampening (\<1)
     * @defaultValue `1`
     * @remarks Parameter default only, `null` is only cast to `0`
     */
    amplification: number;
  }>;

  interface AnimateFlickeringOptions extends RenderedEffectSource.AnimationFunctionOptions, _AnimateFlickeringOptions {}
}

declare abstract class AnyBaseLightSource extends BaseLightSource<
  BaseLightSource.SourceData,
  PIXI.Polygon,
  RenderedEffectSource.Layers
> {
  constructor(arg0: never, ...args: never[]);
}

export default BaseLightSource;
