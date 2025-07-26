import type { Identity, InexactPartial, IntentionalPartial } from "#utils";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";

/**
 * A specialized subclass of BaseEffectSource which deals with the rendering of light or darkness.
 */
declare abstract class BaseLightSource<
  SourceData extends BaseLightSource.SourceData = BaseLightSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = BaseLightSource.Layers,
> extends RenderedEffectSource<SourceData, SourceShape, RenderingLayers> {
  /**
   * @defaultValue `"light"`
   * @privateRemarks left `string` here, with a real and fake override in {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource}
   * and {@linkcode foundry.canvas.sources.PointLightSource | PointLightSource} respectively
   */
  static override sourceType: string;

  /** @defaultValue `["animation.type", "walls"]` */
  protected static override _initializeShaderKeys: string[];

  /**
   * @defaultValue
   * ```js
   * [
   *   "dim",
   *   "bright",
   *   "attenuation",
   *   "alpha",
   *   "coloration",
   *   "color",
   *   "contrast",
   *   "saturation",
   *   "shadows",
   *   "luminosity",
   * ]
   * ```
   */
  protected static override _refreshUniformsKeys: string[];

  /**
   * The corresponding lighting levels for dim light.
   * @defaultValue `CONST.LIGHTING_LEVELS.DIM`
   */
  protected static _dimLightingLevel: CONST.LIGHTING_LEVELS;

  /**
   * The corresponding lighting levels for bright light.
   * @defaultValue `CONST.LIGHTING_LEVELS.BRIGHT`
   */
  protected static _brightLightingLevel: CONST.LIGHTING_LEVELS;

  /**
   * The corresponding animation config.
   * @privateRemarks Only uses {@linkcode CONFIG.Canvas.lightAnimations} in {@linkcode BaseLightSource}, but
   * {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource} overrides to use
   * `.darknessAnimations`, so the union is necessary
   */
  protected static get ANIMATIONS(): typeof CONFIG.Canvas.lightAnimations | typeof CONFIG.Canvas.darknessAnimations;

  /**
   * @defaultValue
   * ```js
   * {
   *   background: {
   *     defaultShader: AdaptiveBackgroundShader,
   *     blendMode: "MAX_COLOR",
   *   },
   *   coloration: {
   *     defaultShader: AdaptiveColorationShader,
   *     blendMode: "SCREEN",
   *   },
   *   illumination: {
   *     defaultShader: AdaptiveIlluminationShader,
   *     blendMode: "MAX_COLOR",
   *   },
   * }
   * ```
   */
  protected static override get _layers(): Record<string, RenderedEffectSource.LayerConfig>;

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
   * @remarks See {@linkcode RenderedEffectSource.defaultData}
   */
  static override defaultData: BaseLightSource.SourceData;

  /**
   * A ratio of dim:bright as part of the source radius
   * @defaultValue `1`
   * @remarks Nothing in `BaseLightSource` or its subclasses sets this except {@linkcode foundry.canvas.sources.PointLightSource._configure | PointLightSource#_configure};
   * for all other subclasses it is always `1`
   */
  ratio: number;

  /**
   * @privateRemarks Fake override to account for losing the ability to return `this` in {@linkcode BaseEffectSource.initialize | BaseEffectSource} and
   * still have Initialized overrides. `BaseLightSource` has no properties that change type when initialized, as it doesn't implement `#_createShapes`
   */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): BaseLightSource<SourceData, SourceShape, RenderingLayers>;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _updateColorationUniforms(): void;

  protected override _updateIlluminationUniforms(): void;

  protected override _updateBackgroundUniforms(): void;

  protected override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /** @remarks Doesn't exist prior to initialization, but not guaranteed to exist after either. Ultimately set in {@linkcode BaseLightSource._updateCommonUniforms | #_updateCommonUniforms} */
  cachedAttenuation?: number;

  /** @remarks Doesn't exist prior to initialization, but not guaranteed to exist after either. Ultimately set in {@linkcode BaseLightSource._updateCommonUniforms | #_updateCommonUniforms} */
  computedAttenuation?: number;

  /**
   * An animation with flickering ratio and light intensity.
   * @param dt      - Delta time
   * @param options - Additional options which modify the torch animation
   * @remarks A valid {@linkcode BaseLightSource.LightAnimationFunction | LightAnimationFunction}
   */
  animateTorch(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * An animation with flickering ratio and light intensity
   * @param dt      - Delta time
   * @param options - Additional options which modify the flame animation
   * @remarks A valid {@linkcode BaseLightSource.LightAnimationFunction | LightAnimationFunction}
   */
  animateFlickering(dt: number, options?: BaseLightSource.AnimateFlickeringOptions): void;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt      - Delta time
   * @param options - Additional options which modify the pulse animation
   * @remarks A valid {@linkcode BaseLightSource.LightAnimationFunction | LightAnimationFunction}
   */
  animatePulse(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * A sound-reactive animation that uses bass/mid/treble blending to control certain shader uniforms.
   * "speed" is interpreted as how quickly we adapt to changes in audio. No time-based pulsing is used by default,
   * but we incorporate dt into smoothing so that behavior is consistent across varying frame rates.
   *
   * @param dt      - The delta time since the last frame, in milliseconds.
   * @param options - Additional options for customizing the audio reaction.
   * @remarks A valid {@linkcode BaseLightSource.LightAnimationFunction | LightAnimationFunction}
   */
  animateSoundPulse(dt: number, options?: BaseLightSource.AnimateSoundPulseOptions): void;

  /**
   * /**
   * @deprecated "`BaseLightSource#isDarkness` is now obsolete. Use {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource} instead." (since v12, until v14)
   * @remarks Always returns `false`, typed as `boolean` to allow `PointDarknessSource` override
   */
  get isDarkness(): boolean;

  #BaseLightSource: true;
}

declare namespace BaseLightSource {
  interface Any extends AnyBaseLightSource {}
  interface AnyConstructor extends Identity<typeof AnyBaseLightSource> {}

  /** @remarks See {@linkcode BaseLightSource._layers} */
  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    background: RenderedEffectSource.SourceLayer;
    coloration: RenderedEffectSource.SourceLayer;
    illumination: RenderedEffectSource.SourceLayer;
  };

  type LightAnimationFunction = (
    this: BaseLightSource.Any,
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
  }

  /** @internal */
  type _AnimateFlickeringOptions = InexactPartial<{
    /**
     * Noise amplification (\>1) or dampening (\<1)
     * @defaultValue `1`
     */
    amplification: number;
  }>;

  interface AnimateFlickeringOptions extends RenderedEffectSource.AnimationFunctionOptions, _AnimateFlickeringOptions {}

  /** @internal */
  type _AnimateSoundPulseOptionsOptions = InexactPartial<{
    /**
     * A smoothing factor in `[0..10]`, effectively updates/second.
     * @defaultValue `5`
     */
    speed: number;

    /**
     * A blend factor in `[0..10]` that transitions from bass (near `0`) to treble (near `10`)
     * Mid frequencies dominate around `intensity=5`.
     * @defaultValue `5`
     */
    intensity: number;

    /**
     * Whether to invert the final amplitude as 1 - amplitude.
     * @defaultValue `false`
     */
    reverse: boolean;
  }>;

  /** @privateRemarks Different property descriptions, otherwise identical to {@linkcode RenderedEffectSource.AnimationFunctionOptions} */
  interface AnimateSoundPulseOptions extends _AnimateSoundPulseOptionsOptions {}
}

declare abstract class AnyBaseLightSource extends BaseLightSource<
  BaseLightSource.SourceData,
  PIXI.Polygon,
  BaseLightSource.Layers
> {
  constructor(...args: never);
}

export default BaseLightSource;
