import type { AnyObject, ConcreteKeys, Identity, InexactPartial, IntentionalPartial } from "#utils";
import type * as sources from "./_module.d.mts";
import type {
  AbstractBaseShader,
  AdaptiveLightingShader,
  AdaptiveBackgroundShader,
  AdaptiveColorationShader,
  AdaptiveIlluminationShader,
  AdaptiveDarknessShader,
} from "#client/canvas/rendering/shaders/_module.d.mts";
import type { PointSourceMesh } from "#client/canvas/containers/_module.d.mts";
import type * as _placeables from "#client/canvas/placeables/_module.d.mts";
import type { LightData } from "#common/data/_module.d.mts";

/**
 * An abstract class which extends the base PointSource to provide common functionality for rendering.
 * This class is extended by both the LightSource and VisionSource subclasses.
 */
declare abstract class RenderedEffectSource<
  SourceData extends RenderedEffectSource.SourceData = RenderedEffectSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = RenderedEffectSource.Layers,
> extends sources.BaseEffectSource<SourceData, SourceShape> {
  /**
   * Keys of the data object which require shaders to be re-initialized.
   * @defaultValue `["animation.type"]`
   * @privateRemarks Presumably, allowing this to contain `"animation.type"` is why `#_configure` is passed flattened data
   */
  protected static _initializeShaderKeys: string[];

  /**
   * Keys of the data object which require uniforms to be refreshed.
   * @defaultValue `[]`
   */
  protected static _refreshUniformsKeys: string[];

  /**
   * Layers handled by this rendered source.
   * @defaultValue `{}`
   * @remarks As of v13, this is `{}` in {@linkcode RenderedEffectSource}, with layer definitions moving to
   * {@linkcode sources.BaseLightSource._layers | BaseLightSource},  {@linkcode sources.PointDarknessSource._layers | PointDarknessSource},
   * and {@linkcode sources.PointVisionSource._layers | PointVisionSource}
   * @privateRemarks Keys should match the keys of RenderingLayers, can't enforce because static
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
   * @remarks See {@linkcode sources.BaseEffectSource.defaultData | BaseEffectSource.defaultData}
   */
  static defaultData: RenderedEffectSource.SourceData;

  /**
   * The animation configuration applied to this source
   * @defaultValue `{}`
   */
  animation: RenderedEffectSource.AnimationConfig;

  /**
   * Track the status of rendering layers
   */
  layers: RenderingLayers;

  /**
   * The color of the source as an RGB vector.
   * @defaultValue `null`
   */
  colorRGB: Color.RGBColorVector | null;

  /**
   * PIXI Geometry generated to draw meshes.
   * @defaultValue `null`
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
   * @remarks `undefined` in {@linkcode RenderedEffectSource}, as it no longer provides anything in
   * {@linkcode RenderedEffectSource._layers | ._layers} as of v13
   */
  get background(): RenderedEffectSource.LayerMesh<RenderingLayers, "background">;

  /**
   * A convenience accessor to the coloration layer mesh.
   * @remarks `undefined` in {@linkcode RenderedEffectSource}, as it no longer provides anything in
   * {@linkcode RenderedEffectSource._layers | ._layers} as of v13
   */
  get coloration(): RenderedEffectSource.LayerMesh<RenderingLayers, "coloration">;

  /**
   * A convenience accessor to the illumination layer mesh.
   * @remarks `undefined` in {@linkcode RenderedEffectSource}, as it no longer provides anything in
   * {@linkcode RenderedEffectSource._layers | ._layers} as of v13
   */
  get illumination(): RenderedEffectSource.LayerMesh<RenderingLayers, "illumination">;

  /**
   * @privateRemarks Fake override to account for losing the ability to return `this` in {@linkcode sources.BaseEffectSource.initialize | BaseEffectSource} and
   * still have Initialized overrides. `RenderedEffectSource` has no properties that change type when initialized, as it doesn't implement `#_createShapes`
   */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: sources.BaseEffectSource.InitializeOptions,
  ): RenderedEffectSource<SourceData, SourceShape, RenderingLayers>;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  /**
   * Decide whether to render soft edges with a blur.
   */
  protected _initializeSoftEdges(): void;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected override _configure(changes: AnyObject): void;

  /**
   * Configure which shaders are used for each rendered layer.
   */
  protected _configureShaders(): Record<keyof RenderingLayers, AdaptiveLightingShader.AnyConstructor>;

  /**
   * Specific configuration for a layer.
   * @remarks Is a no-op in {@linkcode RenderedEffectSource}
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
   * @returns The drawn mesh for this layer, or `null` if no mesh is required
   */
  protected _drawMesh(layerId: keyof RenderingLayers): PointSourceMesh | null;

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
   */
  animate(dt: number): void;

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
  static getCorrectedLevel(level: CONST.LIGHTING_LEVELS): CONST.LIGHTING_LEVELS;

  /**
   * Get corrected color according to level, dim color, bright color and background color.
   */
  static getCorrectedColor(
    level: CONST.LIGHTING_LEVELS,
    colorDim: Color,
    colorBright: Color,
    colorBackground?: Color,
  ): Color;

  #RenderedEffectSource: true;
}

declare namespace RenderedEffectSource {
  interface Any extends AnyRenderedEffectSource {}
  interface AnyConstructor extends Identity<typeof AnyRenderedEffectSource> {}

  interface SourceData extends sources.BaseEffectSource.SourceData {
    /**
     * An animation configuration for the source
     * @defaultValue `{}`
     */
    animation: AnimationConfig;

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
     * @remarks This will remain null in `#data` if not specified, which will lead to using `Math.floor(Math.random() * 100000)` at runtime
     *
     * If specified, this will take precedence over {@linkcode RenderedEffectSource.AnimationConfig.seed | RenderedEffectSource#animation.seed}
     */
    seed: number | null;

    /**
     * Is this source a temporary preview?
     * @defaultValue `false`
     */
    preview: boolean;
  }

  /**
   * @param dt      - Delta time
   * @param options - Additional options which modify the animation
   */
  type AnimationFunction = (this: RenderedEffectSource, dt: number, options?: AnimationFunctionOptions) => void;

  /** @internal */
  type _AnimationFunctionOptions = InexactPartial<{
    /**
     * The animation speed, from 0 to 10
     * @defaultValue `5`
     */
    speed: number;

    /**
     * The animation intensity, from 1 to 10
     * @defaultValue `5`
     */
    intensity: number;

    /**
     * Reverse the animation direction
     * @defaultValue `false`
     */
    reverse: boolean;
  }>;

  /**
   * Shared options for the {@linkcode RenderedEffectSource.AnimationFunction | AnimationFunction}s
   * provided by {@linkcode RenderedEffectSource} and subclasses
   */
  interface AnimationFunctionOptions extends _AnimationFunctionOptions {}

  /**
   * Properties *every* {@linkcode CONFIG.Canvas.lightAnimations}/{@linkcode CONFIG.Canvas.darknessAnimations | darknessAnimations} entry requires
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
    animation: AnimationFunction | sources.BaseLightSource.LightAnimationFunction;
  }

  /** @internal */
  type _Seed = InexactPartial<{
    /**
     * The animation seed
     * @defaultValue `Math.floor(Math.random() * 100000)`
     * @remarks No Foundry-provided config ({@linkcode CONFIG.Canvas.lightAnimations}, {@linkcode CONFIG.Canvas.darknessAnimations})
     * specifies this, but it would be respected if set.
     */
    seed: number;
  }>;

  /**
   * Shaders to override the defaults for each rendering layer this effect affects.
   * @internal
   */
  interface _AnimationConfigLightingShaders {
    /**
     * A custom illumination shader used by this animation
     * @remarks If one isn't provided by this config, the `illumination` layer will use the fallback {@linkcode foundry.canvas.rendering.shaders.AdaptiveIlluminationShader | AdaptiveIlluminationShader}
     */
    illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

    /**
     * A custom coloration shader used by this animation
     * @remarks Required for entries in {@linkcode CONFIG.Canvas.lightAnimations}
     *
     * If one isn't provided by this config, the `coloration` layer will use the fallback {@linkcode foundry.canvas.rendering.shaders.AdaptiveColorationShader | AdaptiveColorationShader}
     */
    colorationShader: AdaptiveColorationShader.AnyConstructor;

    /**
     * A custom background shader used by this animation
     * @remarks If one isn't provided by this config, the `background` layer will use the fallback {@linkcode foundry.canvas.rendering.shaders.AdaptiveBackgroundShader | AdaptiveBackgroundShader}
     */
    backgroundShader: AdaptiveBackgroundShader.AnyConstructor;
  }

  /** @internal */
  interface _AnimationConfigDarknessShaders {
    /**
     * A custom darkness shader used by this animation
     * @remarks Required for entries in {@linkcode CONFIG.Canvas.darknessAnimations}
     *
     * If one isn't provided by this config, the `darkness` layer will use the fallback {@linkcode foundry.canvas.rendering.shaders.AdaptiveDarknessShader | AdaptiveDarknessShader}
     */
    darknessShader: AdaptiveDarknessShader.AnyConstructor;
  }

  /** @internal */
  type _AnimationConfig = InexactPartial<
    _AnimationConfigBase &
      _AnimationConfigLightingShaders &
      _AnimationConfigDarknessShaders &
      _Seed &
      LightData.AnimationData & {
        /**
         * The animation time
         * @remarks Always computed. Set on the stored config by {@linkcode RenderedEffectSource.animateTime | RenderedEffectSource#animateTime}
         */
        time?: number;
      }
  >;

  /**
   * @remarks The type for {@linkcode RenderedEffectSource.animation | RenderedEffectSource#animation} and
   * {@linkcode RenderedEffectSource.data | RenderedEffectSource#data#animation}.
   *
   * {@linkcode _placeables.AmbientLight._getLightSourceData | AmbientLight#_getLightSourceData} and
   * {@linkcode _placeables.Token._getLightSourceData | Token#_getLightSourceData} merge the `toObject(false)`
   * of a {@linkcode LightData} into the source initialization data, so {@linkcode LightData.AnimationData} is
   * included, which is where the `type` property {@linkcode sources.BaseLightSource._initialize | BaseLightSource#_initialize}
   * and subclasses use to pull from CONFIG via {@linkcode sources.BaseLightSource.ANIMATIONS | BaseLightSource.ANIMATIONS}
   * comes from.
   *
   * All properties are optional because `RenderedEffectSource#animation` is initialized to `{}`
   */
  interface AnimationConfig extends _AnimationConfig {}

  type ConfiguredLightAnimations = ConcreteKeys<CONFIG["Canvas"]["lightAnimations"]>;

  type ConfiguredDarknessAnimations = ConcreteKeys<CONFIG["Canvas"]["darknessAnimations"]>;

  type ConfiguredAnimations = ConfiguredLightAnimations | ConfiguredDarknessAnimations;

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
  // RenderedEffectSource provides no layers as of 13.345
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions
  type Layers = {};

  /**
   * @template Layers    - The RenderingLayers type param of the class
   * @template LayerName - The particular layer being checked
   */
  type LayerMesh<Layers extends Record<string, LayerConfig>, LayerName extends string> =
    LayerName extends ConcreteKeys<Layers> ? PointSourceMesh : undefined;
}

export default RenderedEffectSource;

declare abstract class AnyRenderedEffectSource extends RenderedEffectSource<
  RenderedEffectSource.SourceData,
  PIXI.Polygon,
  RenderedEffectSource.Layers
> {
  constructor(...args: never);
}
