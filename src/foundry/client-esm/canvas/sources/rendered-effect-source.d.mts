import type { IntentionalPartial } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";

/**
 * An abstract class which extends the base PointSource to provide common functionality for rendering.
 * This class is extended by both the LightSource and VisionSource subclasses.
 */
declare class RenderedEffectSource<
  SourceData extends RenderedEffectSource.RenderedEffectSourceData = RenderedEffectSource.RenderedEffectSourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.RenderedEffectSourceLayer> = RenderedEffectSource.Layers,
> extends BaseEffectSource<SourceData, SourceShape> {
  /**
   * Keys of the data object which require shaders to be re-initialized.
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
  protected static get _layers(): Record<
    "background" | "coloration" | "illumination",
    RenderedEffectSource.RenderedEffectLayerConfig
  >;

  /**
   * The offset in pixels applied to create soft edges.
   * @defaultValue `-8`
   */
  static EDGE_OFFSET: number;

  /**
   * @defaultValue
   * ```js
   * {
   * ...super.defaultData,
   * animation: {},
   * seed: null,
   * preview: false,
   * color: null
   * }
   * ```
   */
  static defaultData: RenderedEffectSource.RenderedEffectSourceData;

  /**
   * The animation configuration applied to this source
   * @defaultValue `{}`
   */
  animation: RenderedEffectSource.RenderedEffectSourceAnimationConfig;

  /**
   * Track the status of rendering layers
   */
  layers: RenderingLayers;

  /**
   * The color of the source as an RGB vector.
   */
  colorRGB: [number, number, number] | null;

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

  override _initialize(data: IntentionalPartial<SourceData>): void;

  /**
   * Decide whether to render soft edges with a blur.
   */
  protected _initializeSoftEdges(): void;

  override _configure(changes: IntentionalPartial<SourceData>): void;

  /**
   * Configure which shaders are used for each rendered layer.
   * @privateRemarks Foundry marks this as private then overrides it in `PointVisionSource`
   */
  protected _configureShaders(): Record<keyof RenderingLayers, typeof AdaptiveLightingShader>;

  /**
   * Specific configuration for a layer.
   */
  protected _configureLayer(layer: RenderedEffectSource.RenderedEffectSourceLayer, layerId: string): void;

  /**
   * Create the geometry for the source shape that is used in shaders and compute its bounds for culling purpose.
   * Triangulate the form and create buffers.
   * @remarks Marked as abstract
   */
  protected _updateGeometry(): void;

  /**
   * Render the containers used to represent this light source within the LightingLayer
   */
  drawMeshes(): Record<keyof RenderingLayers, PIXI.Mesh | null>;

  /**
   * Create a Mesh for a certain rendered layer of this source.
   * @param layerId - The layer key in layers to draw
   * @returns The drawn mesh for this layer, or null if no mesh is required
   */
  protected _drawMesh(layerId: string): PIXI.Mesh | null;

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
   * @privateRemarks In core this will return `void`, as the `this.animation.animation` function will  be a {@link BaseLightSource.LightAnimationFunction}
   * and in fact most of the time will be `RenderedEffectSource#animateTime`, but it could technically be set to any function
   */
  animate(dt: number): this["animation"]["animation"] extends (...args: any) => infer Return ? Return : void;

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
  static getCorrectedLevel(level: foundry.CONST.LIGHTING_LEVELS): number;

  /**
   * Get corrected color according to level, dim color, bright color and background color.
   */
  static getCorrectedColor(
    level: foundry.CONST.LIGHTING_LEVELS,
    colorDim: Color,
    colorBright: Color,
    colorBackground?: Color,
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
  type Any = RenderedEffectSource<any, any, any>;

  type AnyConstructor = typeof AnyRenderedEffectSource;

  interface RenderedEffectSourceData extends BaseEffectSource.BaseEffectSourceData {
    /**
     * An animation configuration for the source
     */
    animation: object;

    /**
     * A color applied to the rendered effect
     */
    color: number | null;

    /**
     * An integer seed to synchronize (or de-synchronize) animations
     */
    seed: number | null;

    /**
     * Is this source a temporary preview?
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
     * @remarks Can't be null due to only having default via signature
     */
    speed: number;

    /**
     * The animation intensity, from 1 to 10
     * @defaultValue `5`
     * @remarks Can't be null due to only having default via signature
     */
    intensity: number;

    /**
     * Reverse the animation direction
     * @defaultValue `false`
     */
    reverse: boolean | null;
  }>;

  /** Shared options for the {@link AnimationFunction}s provided by `_Source` classes */
  interface AnimationFunctionOptions extends _AnimationFunctionOptions {}

  /** @internal */
  type _RenderedEffectSourceAnimationConfig = InexactPartial<{
    /**
     * The human-readable (localized) label for the animation
     */
    label: string;

    /**
     * The animation function that runs every frame
     * @privateRemarks TODO: Figure out if there's a better way to define the function
     */
    animation: RenderedEffectSource.AnimationFunction;

    /**
     * A custom illumination shader used by this animation
     */
    illuminationShader: typeof AdaptiveIlluminationShader;

    /**
     * A custom coloration shader used by this animation
     */
    colorationShader: typeof AdaptiveColorationShader;

    /**
     * A custom background shader used by this animation
     */
    backgroundShader: typeof AdaptiveBackgroundShader;

    /**
     * A custom darkness shader used by this animation
     */
    darknessShader: typeof AdaptiveDarknessShader;

    /**
     * The animation seed
     */
    seed: number;

    /**
     * The animation time
     */
    time: number;
  }>;

  interface RenderedEffectSourceAnimationConfig extends _RenderedEffectSourceAnimationConfig {}

  /**
   * @remarks `mesh` and `shader` are given values during initialization *if* the Source has a valid `Placeable` as its `object`.
   * `vmUniforms` is only provided for `PointVisionSource` layers.
   */
  interface RenderedEffectSourceLayer extends RenderedEffectLayerConfig {
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

    /** @remarks Foundry does not include this in the typedef but is in the initalization of `RenderedEffectSource#layers` */
    vmUniforms: AbstractBaseShader.Uniforms | undefined;
  }

  interface RenderedEffectLayerConfig {
    /**
     * The default shader used by this layer
     */
    defaultShader: typeof AdaptiveLightingShader;

    /**
     * The blend mode used by this layer
     */
    blendMode: keyof typeof PIXI.BLEND_MODES;
  }

  // Interface causes errors
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    background: RenderedEffectSource.RenderedEffectSourceLayer;
    coloration: RenderedEffectSource.RenderedEffectSourceLayer;
    illumination: RenderedEffectSource.RenderedEffectSourceLayer;
  };
}

declare abstract class AnyRenderedEffectSource extends RenderedEffectSource<any, any, any> {
  constructor(arg0: never, ...args: never[]);
}

export default RenderedEffectSource;
