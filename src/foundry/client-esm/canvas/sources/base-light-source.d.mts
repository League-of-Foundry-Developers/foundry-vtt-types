import type { InexactPartial, IntentionalPartial } from "../../../../utils/index.d.mts";
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
   * @remarks More broad than it should be to accomodate {@link foundry.canvas.sources.PointDarknessSource}
   * TODO: Reevaluate after CONFIG has been gone over
   */
  protected static get ANIMATIONS(): typeof CONFIG.Canvas.lightAnimations | typeof CONFIG.Canvas.darknessAnimations;

  /**
   * @defaultValue
   * ```js
   * {
   * ...super.defaultData,
   * priority: 0,
   * alpha: 0.5,
   * bright: 0,
   * coloration: 1,
   * contrast: 0,
   * dim: 0,
   * attenuation: 0.5,
   * luminosity: 0.5,
   * saturation: 0,
   * shadows: 0,
   * vision: false
   * }
   * ```
   */
  static override defaultData: BaseLightSource.SourceData;

  /**
   * A ratio of dim:bright as part of the source radius
   */
  ratio: number;

  override _initialize(data: IntentionalPartial<SourceData>): void;

  override _updateColorationUniforms(): void;

  override _updateIlluminationUniforms(): void;

  override _updateBackgroundUniforms(): void;

  override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /** @remarks This property is undocumented, and only defined during `_updateCommonUniforms` */
  cachededAttentuation?: number;

  /** @remarks This property is undocumented, and only defined during `_updateCommonUniforms` */
  computedAttentuation?: number;

  /**
   * An animation with flickering ratio and light intensity.
   * @param dt      - Delta time
   * @param options - Additional options which modify the torch animation
   */
  animateTorch(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * An animation with flickering ratio and light intensity
   * @param dt      - Delta time
   * @param options - Additional options which modify the flame animation
   */
  animateFlickering(
    dt: number,
    options?: RenderedEffectSource.AnimationFunctionOptions &
      InexactPartial<{
        /**
         * Noise amplification (\>1) or dampening (\<1)
         * @defaultValue `1`
         */
        amplification: number;
      }>,
  ): void;

  /**
   * @remarks This property will be generated on any class that is `animateFlickering`'s `this` when it is called.
   * Foundry does not document it.
   */
  _noise?: SmoothNoise;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt      - Delta time
   * @param options - Additional options which modify the pulse animation
   */
  animatePulse(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * @deprecated since v12, until v14
   * @remarks "BaseLightSource#isDarkness is now obsolete. Use DarknessSource instead."
   */
  get isDarkness(): boolean;
}

declare namespace BaseLightSource {
  type AnyConstructor = typeof AnyBaseLightSource;

  type LightAnimationFunction = (
    this: BaseLightSource,
    dt: number,
    options?: RenderedEffectSource.AnimationFunctionOptions,
  ) => void;

  interface SourceData extends RenderedEffectSource.SourceData {
    /**
     * An opacity for the emitted light, if any
     */
    alpha: number;

    /**
     * The allowed radius of bright vision or illumination
     */
    bright: number;

    /**
     * The coloration technique applied in the shader
     */
    coloration: number;

    /**
     * The amount of contrast this light applies to the background texture
     */
    contrast: number;

    /**
     * The allowed radius of dim vision or illumination
     */
    dim: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     */
    attenuation: number;

    /**
     * The luminosity applied in the shader
     */
    luminosity: number;

    /**
     * The amount of color saturation this light applies to the background texture
     */
    saturation: number;

    /**
     * The depth of shadows this light applies to the background texture
     */
    shadows: number;

    /**
     * Whether or not this source provides a source of vision
     */
    vision: boolean;

    /**
     * Strength of this source to beat or not negative/positive sources
     */
    priority: number;
  }
}

declare abstract class AnyBaseLightSource extends BaseLightSource {
  constructor(arg0: never, ...args: never[]);
}

export default BaseLightSource;
