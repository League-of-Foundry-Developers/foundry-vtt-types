import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type { IntentionalPartial } from "../../../../types/helperTypes.d.mts";

/**
 * A specialized subclass of RenderedEffectSource which represents a source of point-based vision.
 */
declare class PointVisionSource<
  SourceData extends PointVisionSource.SourceData = PointVisionSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
  RenderingLayers extends RenderedEffectSource.Layers = RenderedEffectSource.Layers,
> extends PointEffectSourceMixin(RenderedEffectSource)<SourceData, SourceShape, RenderingLayers> {
  /** @defaultValue `"sight"` */
  static override sourceType: string;

  /** @defaultValue `["visionMode", "blinded"]` */
  static override _initializeShaderKeys: string[];

  /** @defaultValue `["radius", "color", "attenuation", "brightness", "contrast", "saturation", "visionMode"]` */
  static override _refreshUniformsKeys: string[];

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

  static override EDGE_OFFSET: number;

  /** @defaultValue `"visionSources"` */
  static override effectsCollection: string;

  /**
   * @defaultValue
   * ```js
   * {
   * ...super.defaultData,
   * contrast: 0,
   * attenuation: 0.5,
   * saturation: 0,
   * brightness: 0,
   * visionMode: "basic",
   * lightRadius: null
   * }
   * ```
   */
  static override defaultData: PointVisionSource.SourceData;

  /** @remarks Overrides `Adaptive*Shader` references with `*VisionShader` ones */
  static get _layers(): Record<string, RenderedEffectSource.LayerConfig>;

  /**
   * The vision mode linked to this VisionSource
   */
  visionMode: VisionMode | null;

  /**
   * The vision mode activation flag for handlers
   * @internal
   */
  _visionModeActivated: boolean;

  /**
   * The unconstrained LOS polygon.
   */
  los: PointSourcePolygon;

  /**
   * The polygon of light perception.
   */
  light: PointSourcePolygon;

  /**
   * An alias for the shape of the vision source.
   */
  get fov(): PIXI.Polygon | PointSourcePolygon;

  /**
   * If this vision source background is rendered into the lighting container.
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
  blinded: Record<string, boolean>;

  /**
   * Data overrides that could happen with blindness vision mode.
   */
  visionModeOverrides: object;

  override _initialize(data: IntentionalPartial<SourceData>): void;

  override _createShapes(): void;

  /**
   * Responsible for assigning the Vision Mode and calling the activation and deactivation handlers.
   */
  protected _updateVisionMode(): void;

  override _configure(changes: IntentionalPartial<SourceData>): void;

  override _configureLayer(layer: RenderedEffectSource.SourceLayer, layerId: string): void;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Creates the polygon that represents light perception.
   * If the light perception radius is unconstrained, no new polygon instance is created;
   * instead the LOS polygon of this vision source is returned.
   * @returns The new polygon or `this.los`.
   */
  protected _createLightPolygon(): PointSourcePolygon;

  /**
   * Create a restricted FOV polygon by limiting the radius of the unrestricted LOS polygon.
   * If the vision radius is unconstrained, no new polygon instance is created;
   * instead the LOS polygon of this vision source is returned.
   * @returns The new polygon or `this.los`.
   */
  protected _createRestrictedPolygon(): PointSourcePolygon;

  override _configureShaders(): Record<keyof RenderingLayers, typeof AdaptiveVisionShader>;

  override _updateColorationUniforms(): void;

  override _updateIlluminationUniforms(): void;

  override _updateBackgroundUniforms(): void;

  override _updateCommonUniforms(shader: AbstractBaseShader): void;

  /**
   * Update layer uniforms according to vision mode uniforms, if any.
   * @param shader     - The shader being updated.
   * @param vmUniforms - The targeted layer.
   */
  protected _updateVisionModeUniforms(shader: AdaptiveVisionShader, vmUniforms: AbstractBaseShader.Uniforms): void;
}

declare namespace PointVisionSource {
  type Any = PointVisionSource<SourceData>;

  type AnyConstructor = typeof AnyPointVisionSource;

  interface SourceData extends RenderedEffectSource.SourceData, PointEffectSourceMixin.SourceData {
    /**
     * The amount of contrast
     */
    contrast: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     */
    attenuation: number;

    /**
     * The amount of color saturation
     */
    saturation: number;

    /**
     * The vision brightness.
     */
    brightness: number;

    /**
     * The vision mode.
     */
    visionMode: string;

    /**
     * The range of light perception.
     */
    lightRadius: number | null;

    /**
     * Is this vision source blinded?
     */
    blinded: boolean;
  }
}

declare abstract class AnyPointVisionSource extends PointVisionSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointVisionSource;
