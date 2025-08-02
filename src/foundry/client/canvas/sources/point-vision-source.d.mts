import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type {
  AnyObject,
  FixedInstanceType,
  Identity,
  InexactPartial,
  IntentionalPartial,
  Override,
  RequiredProps,
} from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { ClockwiseSweepPolygon } from "#client/canvas/geometry/_module.d.mts";
import type { VisionMode } from "#client/canvas/perception/_module.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type { PointSourceMesh } from "#client/canvas/containers/_module.d.mts";

/**
 * A specialized subclass of RenderedEffectSource which represents a source of point-based vision.
 */
declare class PointVisionSource<
  SourceData extends PointVisionSource.SourceData = PointVisionSource.SourceData,
  SourceShape extends ClockwiseSweepPolygon = PointVisionSource.ImplementationPolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = PointVisionSource.Layers,
> extends PointEffectSourceMixin(RenderedEffectSource)<SourceData, SourceShape, RenderingLayers> {
  static override sourceType: "sight";

  /** @defaultValue `["visionMode", "blinded"]` */
  protected static override _initializeShaderKeys: string[];

  /** @defaultValue `["radius", "color", "attenuation", "brightness", "contrast", "saturation", "visionMode"]` */
  protected static override _refreshUniformsKeys: string[];

  /**
   * The corresponding lighting levels for dim light.
   * @defaultValue {@linkcode CONST.LIGHTING_LEVELS.DIM}
   */
  protected static _dimLightingLevel: CONST.LIGHTING_LEVELS;

  /**
   * The corresponding lighting levels for bright light.
   * @defaultValue {@linkcode CONST.LIGHTING_LEVELS.BRIGHT}
   */
  protected static _brightLightingLevel: CONST.LIGHTING_LEVELS;

  /** @defaultValue `-2` */
  static override EDGE_OFFSET: number;

  /** @defaultValue `"visionSources"` */
  static override effectsCollection: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   contrast: 0,
   *   attenuation: 0.5,
   *   saturation: 0,
   *   brightness: 0,
   *   visionMode: "basic",
   *   lightRadius: null
   * }
   * ```
   * @remarks See {@linkcode RenderedEffectSource.defaultData}, {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   */
  static override defaultData: PointVisionSource.SourceData;

  /**
   * @defaultValue
   * ```js
   * {
   *   background: {
   *     defaultShader: BackgroundVisionShader,
   *     blendMode: "MAX_COLOR"
   *   },
   *   coloration: {
   *     defaultShader: ColorationVisionShader,
   *     blendMode: "SCREEN"
   *   },
   *   illumination: {
   *     defaultShader: IlluminationVisionShader,
   *     blendMode: "MAX_COLOR"
   *   }
   * }
   * ```
   */
  protected static get _layers(): Record<string, RenderedEffectSource.LayerConfig>;

  /**
   * The vision mode linked to this VisionSource
   * @remarks This is only `null` prior to initialization; its set to {@linkcode CONFIG.Canvas.visionModes}`[this.data.visionMode]`
   * in {@linkcode PointVisionSource._updateVisionMode | #_updateVisionMode}, and `this.data.visionMode` has a fallback of `"basic"`
   * applied in `#_initialize`
   */
  visionMode: VisionMode | null;

  /**
   * The vision mode activation flag for handlers
   * @remarks Foundry marked `@internal`.
   *
   * Read and set externally in {@link VisionMode.activate | `VisionMode#activate`} and {@link VisionMode.deactivate | `VisionMode#deactivate`}
   */
  protected _visionModeActivated: boolean;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  /**
   * The unconstrained LOS polygon.
   * @remarks Initialization includes `this.los = this.shape` in `#_createShapes()`
   */
  los: SourceShape | undefined;

  /**
   * The polygon of light perception.
   * @remarks Initialization includes `this.light = this._createLightPolygon()` in `#_createShapes()`
   */
  light: SourceShape | undefined;

  /**
   * An alias for the shape of the vision source.
   * @remarks `undefined` prior to initialization
   */
  get fov(): SourceShape | undefined;

  /**
   * If this vision source background is rendered into the lighting container.
   * @remarks `undefined` prior to initialization
   */
  get preferred(): boolean | undefined;

  /**
   * Is the rendered source animated?
   */
  get isAnimated(): boolean;

  /**
   * Light perception radius of this vision source, taking into account if the source is blinded.
   */
  get lightRadius(): number;

  override get radius(): number;

  /**
   * Is this source temporarily blinded?
   */
  get isBlinded(): boolean;

  /**
   * Records of blinding strings with a boolean value.
   * By default, if any of this record is true, the source is blinded.
   */
  blinded: PointVisionSource.BlindedReasons;

  /**
   * Data overrides that could happen with blindness vision mode.
   * @remarks Initialized in the class to `{}`, but filled in during actual initialization (`#_updateVisionMode` via `#_createShapes`)
   */
  visionModeOverrides: PointVisionSource.VisionModeOverrides;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointVisionSource.Initialized<SourceData, SourceShape, RenderingLayers>;

  /** @privateRemarks Fake override to reinstate the keyof constraint we lost in the mixin */
  protected _drawMesh(layerId: keyof RenderingLayers): PointSourceMesh | null;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _createShapes(): void;

  /**
   * Responsible for assigning the Vision Mode and calling the activation and deactivation handlers.
   */
  protected _updateVisionMode(): void;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected override _configure(changes: AnyObject): void;

  protected override _configureLayer(layer: RenderedEffectSource.SourceLayer, layerId: string): void;

  protected override _getPolygonConfiguration(): PointVisionSource.PolygonConfig;

  /**
   * Creates the polygon that represents light perception.
   * If the light perception radius is unconstrained, no new polygon instance is created;
   * instead the LOS polygon of this vision source is returned.
   * @returns The new polygon or `this.los`.
   */
  protected _createLightPolygon(): SourceShape;

  /**
   * Create a restricted FOV polygon by limiting the radius of the unrestricted LOS polygon.
   * If the vision radius is unconstrained, no new polygon instance is created;
   * instead the LOS polygon of this vision source is returned.
   * @returns The new polygon or `this.los`.
   */
  protected _createRestrictedPolygon(): SourceShape;

  protected override _configureShaders(): Record<keyof RenderingLayers, AdaptiveVisionShader.AnyConstructor>;

  protected override _updateColorationUniforms(): void;

  protected override _updateIlluminationUniforms(): void;

  protected override _updateBackgroundUniforms(): void;

  protected override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /**
   * Update layer uniforms according to vision mode uniforms, if any.
   * @param shader     - The shader being updated.
   * @param vmUniforms - The targeted layer.
   */
  protected _updateVisionModeUniforms(
    shader: AdaptiveVisionShader,
    vmUniforms: Array<[string, AbstractBaseShader.UniformValue]>,
  ): void;

  #PointVisionSource;
}

declare namespace PointVisionSource {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPointVisionSource {}
    interface AnyConstructor extends Identity<typeof AnyPointVisionSource> {}
  }

  /** @remarks See {@linkcode PointVisionSource._layers} */
  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    background: RenderedEffectSource.SourceLayer;
    coloration: RenderedEffectSource.SourceLayer;
    illumination: RenderedEffectSource.SourceLayer;
  };

  type Initialized<
    SourceData extends PointVisionSource.SourceData = PointVisionSource.SourceData,
    SourceShape extends ClockwiseSweepPolygon = PointVisionSource.ImplementationPolygon,
    RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = PointVisionSource.Layers,
  > = Override<
    PointVisionSource<SourceData, SourceShape, RenderingLayers>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape;

      /** The vision mode linked to this VisionSource */
      visionMode: VisionMode;

      /** The unconstrained LOS polygon. */
      los: SourceShape;

      /** The polygon of light perception. */
      light: SourceShape;

      /** An alias for the shape of the vision source. */
      get fov(): SourceShape;

      /** If this vision source background is rendered into the lighting container. */
      get preferred(): boolean;
    }
  >;

  interface SourceData extends RenderedEffectSource.SourceData, PointEffectSourceMixin.SourceData {
    /**
     * The amount of contrast
     * @defaultValue `0`
     */
    contrast: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     * @defaultValue `0.5`
     */
    attenuation: number;

    /**
     * The amount of color saturation
     * @defaultValue `0`
     */
    saturation: number;

    /**
     * The vision brightness
     * @defaultValue `0`.
     */
    brightness: number;

    /**
     * The vision mode.
     * @defaultValue `"basic"`
     */
    visionMode: VisionMode.ConfiguredModes;

    /**
     * The range of light perception.
     * @defaultValue `null`
     * @remarks `null` is treated as `0` for `get LightRadius()` purposes, and while this
     * will be `null` in `.defaultData`, `PointVisionSource#_initialize` will replace it
     * with `Math.max(canvas.dimensions.maxR, this.data.externalRadius)` if it's not
     * otherwise specified
     */
    lightRadius: number | null;

    /**
     * Is this vision source blinded?
     */
    blinded: boolean;
  }

  /**
   * @privateRemarks Foundry types the property this is for as just `object`.
   * Keys found in {@linkcode PointVisionSource._updateVisionMode | #_updateVisionMode}
   */
  interface VisionModeOverrides {
    colorRGB: Color.RGBColorVector | null;
    brightness: number;
    contrast: number;
    saturation: number;
    attenuation: number;
  }

  /** @privateRemarks Foundry types this as just the Record, but only ever checks the one key */
  interface BlindedReasons extends Record<string, boolean | undefined> {
    /** @remarks See `PointVisionSource##updateBlindedState` */
    darkness?: boolean | undefined;

    /** @remarks See {@linkcode foundry.canvas.placeables.Token._getVisionBlindedStates | Token#_getVisionBlindedStates} */
    blind?: boolean | undefined;

    /** @remarks See {@linkcode foundry.canvas.placeables.Token._getVisionBlindedStates | Token#_getVisionBlindedStates} */
    burrow?: boolean | undefined;
  }

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "radius" | "useThreshold"> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["visionSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface ImplementationPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["sight"]> {}
  interface ImplementationPolygon extends FixedInstanceType<ImplementationPolygonClass> {}
}

declare abstract class AnyPointVisionSource extends PointVisionSource<
  PointVisionSource.SourceData,
  ClockwiseSweepPolygon,
  PointVisionSource.Layers
> {
  constructor(...args: never);
}

export default PointVisionSource;
