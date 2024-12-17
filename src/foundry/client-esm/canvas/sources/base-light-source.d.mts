import type { InexactPartial } from "../../../../types/utils.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

/**
 * A specialized subclass of BaseEffectSource which deals with the rendering of light or darkness.
 */
declare class BaseLightSource<
  SourceData extends BaseLightSource.LightSourceData = BaseLightSource.LightSourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.RenderedEffectSourceLayer> = RenderedEffectSource.Layers,
> extends RenderedEffectSource<SourceData, SourceShape, RenderingLayers> {
  /** @defaultValue `"light"` */
  static override sourceType: string;

  /** @defaultValue `["animation.type", "walls"]` */
  protected static override _initializeShaderKeys: string[];

  /** @defaultValue `["dim", "bright", "attenuation", "alpha", "coloration", "color", "contrast", "saturation", "shadows", "luminosity"]` */
  protected static override _refreshUniformsKeys: string[];

  /**
   * The corresponding lighting levels for dim light.
   */
  protected static _dimLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /**
   * The corresponding lighting levels for bright light.
   */
  protected static _brightLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /**
   * The corresponding animation config.
   */
  protected static get ANIMATIONS(): CONFIG.Canvas.LightSourceAnimationConfig;

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
  static override defaultData: RenderedEffectSource.RenderedEffectSourceData;

  /**
   * A ratio of dim:bright as part of the source radius
   */
  ratio: number;

  override _initialize(data: Partial<SourceData>): void;

  override _updateColorationUniforms(): void;

  override _updateIlluminationUniforms(): void;

  override _updateBackgroundUniforms(): void;

  override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /**
   * An animation with flickering ratio and light intensity.
   * @param dt      - Delta time
   * @param options - Additional options which modify the torch animation
   */
  animateTorch(dt: number, options?: InexactPartial<RenderedEffectSource.AnimationOptions>): void;

  /**
   * An animation with flickering ratio and light intensity
   * @param dt      - Delta time
   * @param options - Additional options which modify the flame animation
   */
  animateFlickering(
    dt: number,
    options?: InexactPartial<
      RenderedEffectSource.AnimationOptions & {
        /**
         * Noise amplification (\>1) or dampening (\<1)
         * @defaultValue `1`
         */
        amplification: number;
      }
    >,
  ): void;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt      - Delta time
   * @param options - Additional options which modify the pulse animation
   */
  animatePulse(dt: number, options?: InexactPartial<RenderedEffectSource.AnimationOptions>): void;

  /**
   * @deprecated since v12
   */
  get isDarkness(): boolean;
}

declare namespace BaseLightSource {
  interface LightSourceData extends RenderedEffectSource.RenderedEffectSourceData {
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

export default BaseLightSource;
