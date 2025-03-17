import type { AnyObject, Identity, InexactPartial, IntentionalPartial, NullishProps } from "fvtt-types/utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type BaseLightSource from "./base-light-source.d.mts";

/**
 * An abstract class which extends the base PointSource to provide common functionality for rendering.
 * This class is extended by both the LightSource and VisionSource subclasses.
 */
declare abstract class RenderedEffectSource<
  SourceData extends RenderedEffectSource.SourceData = RenderedEffectSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = RenderedEffectSource.Layers,
> extends BaseEffectSource<SourceData, SourceShape> {
  /**
   * Keys of the data object which require shaders to be re-initialized.
   * @privateRemarks Presumably, allowing this to contain `"animation.type"` in `BaseLightSource` is why
   * `#_configure` is passed flattened data
   */
  protected static _initializeShaderKeys: string[];

  /**
   * Keys of the data object which require uniforms to be refreshed.
   */
  protected static _refreshUniformsKeys: string[];

  /**
   * Layers handled by this rendered source.
   * @remarks Keys should match the keys of RenderingLayers
   */
  protected static get _layers(): Record<string, RenderedEffectSource.LayerConfig>;

  /**
   * The offset in pixels applied to create soft edges.
   * @defaultValue `-8`
   */
  static EDGE_OFFSET: number;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   animation: {},
   *   seed: null,
   *   preview: false,
   *   color: null
   * }
   * ```
   */
  static defaultData: RenderedEffectSource.SourceData;

  /**
   * The animation configuration applied to this source
   * @defaultValue `{}`
   */
  animation: RenderedEffectSource.StoredAnimationConfig;

  /**
   * Track the status of rendering layers
   */
  layers: RenderingLayers;

  /**
   * The color of the source as an RGB vector.
   */
  colorRGB: Color.RGBColorVector | null;

  /**
   * PIXI Geometry generated to draw meshes.
   */
  protected _geometry: PIXI.Geometry | null;

  /**
   * Is the rendered source animated?
   */
  get isAnimated(): boolean;

  /**
   * Has the rendered source at least one active layer?
   */
  get hasActiveLayer(): boolean;

  /**
   * Is this RenderedEffectSource a temporary preview?
   */
  get isPreview(): boolean;

  /**
   * A convenience accessor to the background layer mesh.
   */
  get background(): PointSourceMesh;

  /**
   * A convenience accessor to the coloration layer mesh.
   */
  get coloration(): PointSourceMesh;

  /**
   * A convenience accessor to the illumination layer mesh.
   */
  get illumination(): PointSourceMesh;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  /**
   * Decide whether to render soft edges with a blur.
   */
  protected _initializeSoftEdges(): void;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected override _configure(changes: AnyObject): void;

  /**
   * Configure which shaders are used for each rendered layer.
   * @privateRemarks Foundry marks this as private then overrides it in `PointVisionSource`
   */
  protected _configureShaders(): Record<keyof RenderingLayers, AdaptiveLightingShader.AnyConstructor>;

  /**
   * Specific configuration for a layer.
   * @remarks Is a no-op in `RenderedEffectSource`
   */
  protected _configureLayer(layer: RenderedEffectSource.SourceLayer, layerId: string): void;

  /**
   * Create the geometry for the source shape that is used in shaders and compute its bounds for culling purpose.
   * Triangulate the form and create buffers.
   * @remarks Marked as abstract
   */
  protected _updateGeometry(): void;

  /**
   * Render the containers used to represent this light source within the LightingLayer
   * @remarks Will error if called prior to initialization
   */
  drawMeshes(): Record<keyof RenderingLayers, PointSourceMesh | null>;

  /**
   * Create a Mesh for a certain rendered layer of this source.
   * @param layerId - The layer key in layers to draw
   * @returns The drawn mesh for this layer, or null if no mesh is required
   */
  protected _drawMesh(layerId: string): PointSourceMesh | null;

  /**
   * Update shader uniforms used by every rendered layer.
   */
  protected _updateCommonUniforms(shader: AbstractBaseShader): void;

  /**
   * Update shader uniforms used for the background layer.
   */
  protected _updateBackgroundUniforms(): void;

  /**
   * Update shader uniforms used for the coloration layer.
   */
  protected _updateColorationUniforms(): void;

  /**
   * Update shader uniforms used for the illumination layer.
   */
  protected _updateIlluminationUniforms(): void;

  protected override _destroy(): void;

  /**
   * Animate the PointSource, if an animation is enabled and if it currently has rendered containers.
   * @param dt - Delta time.
   * @privateRemarks In core this will return `void`, as the `this.animation.animation` function will  be a {@link foundry.canvas.sources.BaseLightSource.LightAnimationFunction | `LightAnimationFunction`}
   * and in fact most of the time will be {@link foundry.canvas.sources.RenderedEffectSource.animateTime | `RenderedEffectSource#animateTime`}, but it could technically be set to any function
   */
  animate(dt: number): this["animation"]["animation"] extends (...args: infer _1) => infer Return ? Return : void;

  /**
   * Generic time-based animation used for Rendered Point Sources.
   * @param dt      - Delta time.
   * @param options - Options which affect the time animation
   */
  animateTime(dt: number, options?: RenderedEffectSource.AnimationFunctionOptions): void;

  /**
   * Get corrected level according to level and active vision mode data.
   * @returns The corrected level.
   */
  static getCorrectedLevel(level: foundry.CONST.LIGHTING_LEVELS): foundry.CONST.LIGHTING_LEVELS;

  /**
   * Get corrected color according to level, dim color, bright color and background color.
   */
  static getCorrectedColor(
    level: foundry.CONST.LIGHTING_LEVELS,
    colorDim: Color,
    colorBright: Color,
    colorBackground?: Color | null,
  ): Color;

  /**
   * @deprecated since v11, until v13
   * @remarks "The RenderedEffectSource#preview is deprecated. Use RenderedEffectSource#isPreview instead."
   */
  set preview(preview: boolean);

  /**
   * @deprecated since v11, until v13
   * @remarks "The RenderedEffectSource#preview is deprecated. Set RenderedEffectSource#preview as part of RenderedEffectSource#initialize instead."
   */
  get preview(): boolean;
}

declare namespace RenderedEffectSource {
  interface Any extends AnyRenderedEffectSource {}
  interface AnyConstructor extends Identity<typeof AnyRenderedEffectSource> {}

  interface SourceData extends BaseEffectSource.SourceData {
    /**
     * An animation configuration for the source
     * @defaultValue `{}`
     */
    animation: StoredAnimationConfig;

    /**
     * A color applied to the rendered effect
     * @defaultValue `null`
     * @remarks Foundry types as `number`, but it gets passed to `Color.from()`
     *
     * If `null`, Foundry will use the associated shader's `.defaultUniforms.color`
     */
    color: Color.Source | null;

    /**
     * An integer seed to synchronize (or de-synchronize) animations
     * @defaultValue `null`
     * @remarks This will remain null in `#data` if not specified, which will lead to `Math.floor(Math.random() * 100000)`
     *
     * If specified, takes precedence over `RenderedEffectSource#animation.seed`
     */
    seed: number | null;

    /**
     * Is this source a temporary preview?
     * @defaultValue `false`
     */
    preview: boolean;
  }

  type AnimationFunction = (
    this: RenderedEffectSource,
    /** Delta time */
    dt: number,
    options?: AnimationFunctionOptions,
  ) => void;

  /** @internal */
  type _AnimationFunctionOptions = InexactPartial<{
    /**
     * The animation speed, from 0 to 10
     * @defaultValue `5`
     * @remarks Can't be `null` as it only has a parameter default
     */
    speed: number;

    /**
     * The animation intensity, from 1 to 10
     * @defaultValue `5`
     * @remarks Can't be `null` as it only has a parameter default
     */
    intensity: number;

    /**
     * Reverse the animation direction
     * @defaultValue `false`
     */
    reverse: boolean | null;
  }>;

  /** Shared options for the {@link RenderedEffectSource.AnimationFunction | `AnimationFunction`}s provided by {@link foundry.canvas.sources.RenderedEffectSource | `RenderedEffectSource`} and subclasses */
  interface AnimationFunctionOptions extends _AnimationFunctionOptions {}

  /**
   * Properties *every* core-provided config has
   * @internal
   */
  interface _AnimationConfigBase {
    /**
     * The human-readable (localized) label for the animation
     * @remarks Despite the above, all of the core-provided configs provide a localization
     * key here, not localized text.
     */
    label: string;

    /**
     * The animation function that runs every frame
     * @privateRemarks Eventually called with `animation?.call()`, but at no point is a default provided,
     * and not having one is nonsensical.
     */
    animation: AnimationFunction | BaseLightSource.LightAnimationFunction;
  }

  /** @internal */
  type _Seed = NullishProps<{
    /**
     * The animation seed
     * @defaultValue `Math.floor(Math.random() * 100000)`
     * @remarks No Foundry-provided config specifies this, but it would be respected if set
     */
    seed: number;
  }>;

  /**
   * Each Foundry-provided entry in `CONFIG.Canvas.lightAnimations` provides at least a `colorationShader`,
   * but any properties not provided will be backfilled by `|| this.layers[layer].defaultShader`
   * @internal
   */
  type _AnimationConfigLightingShaders = NullishProps<{
    /**
     * A custom illumination shader used by this animation
     * @defaultValue `AdaptiveIlluminationShader`
     */
    illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

    /**
     * A custom coloration shader used by this animation
     * @defaultValue `AdaptiveColorationShader`
     */
    colorationShader: AdaptiveColorationShader.AnyConstructor;

    /**
     * A custom background shader used by this animation
     * @defaultValue `AdaptiveBackgroundShader`
     */
    backgroundShader: AdaptiveBackgroundShader.AnyConstructor;
  }> & { darknessShader?: never };

  /**
   * Foundry's typedef lists `darknessShader` as required, and every core-provided config
   * has one specified, but it has a default just like the lighting shaders
   * @internal
   */
  interface _AnimationConfigDarknessShaders {
    /**
     * A custom darkness shader used by this animation
     * @defaultValue `AdaptiveDarknessShader`
     */
    darknessShader: AdaptiveDarknessShader.AnyConstructor;

    illuminationShader?: never;
    colorationShader?: never;
    backgroundShader?: never;
  }

  /**
   * `this.animation.time` always gets set by `RenderedEffectSource#animateTime`,
   * which all animation functions end up calling
   * @internal
   */
  type _AnimationConfigComputed = InexactPartial<{
    /**
     * The animation time
     * @remarks Always computed, never specified in `CONFIG`
     */
    time: number;
  }>;

  interface LightAnimationConfig extends _AnimationConfigBase, _Seed, _AnimationConfigLightingShaders {}

  interface StoredLightAnimationConfig extends IntentionalPartial<LightAnimationConfig>, _AnimationConfigComputed {}

  interface DarknessAnimationConfig extends _AnimationConfigBase, _Seed, _AnimationConfigDarknessShaders {}

  interface StoredDarknessAnimationConfig
    extends IntentionalPartial<DarknessAnimationConfig>,
      _AnimationConfigComputed {}

  type AnimationConfig = LightAnimationConfig | DarknessAnimationConfig;

  type StoredAnimationConfig = StoredLightAnimationConfig | StoredDarknessAnimationConfig;
  /**
   * @remarks The properties `mesh` and `shader` from `LayerConfig` are not documented as being part of the typedef. They are given values
   * during initialization *if* the Source has a valid `Placeable` as its `object`. `vmUniforms` is only provided a value for `PointVisionSource` layers.
   */
  interface SourceLayer extends LayerConfig {
    /**
     * Is this layer actively rendered?
     */
    active: boolean;

    /**
     * Do uniforms need to be reset?
     */
    reset: boolean;

    /**
     * Is this layer temporarily suppressed?
     */
    suppressed: boolean;

    /**
     * The rendered mesh for this layer
     */
    mesh: PointSourceMesh | undefined;

    /**
     * The shader instance used for the layer
     */
    shader: AdaptiveLightingShader | undefined;

    /** @remarks Foundry does not include this in the typedef but is in the initialization of `RenderedEffectSource#layers` */
    vmUniforms: AbstractBaseShader.Uniforms | undefined;
  }

  interface LayerConfig {
    /**
     * The default shader used by this layer
     */
    defaultShader: AdaptiveLightingShader.AnyConstructor;

    /**
     * The blend mode used by this layer
     */
    blendMode: keyof typeof PIXI.BLEND_MODES;
  }

  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    background: RenderedEffectSource.SourceLayer;
    coloration: RenderedEffectSource.SourceLayer;
    illumination: RenderedEffectSource.SourceLayer;
  };
}

declare abstract class AnyRenderedEffectSource extends RenderedEffectSource<
  RenderedEffectSource.SourceData,
  PIXI.Polygon,
  RenderedEffectSource.Layers
> {
  constructor(arg0: never, ...args: never[]);
}

export default RenderedEffectSource;
