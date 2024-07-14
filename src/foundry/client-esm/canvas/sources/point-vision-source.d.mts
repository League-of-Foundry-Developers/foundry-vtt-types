import RenderedEffectSource from "./rendered-effect-source.mts";
import PointEffectSourceMixin from "./point-effect-source.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";

/**
 * A specialized subclass of RenderedEffectSource which represents a source of point-based vision.
 */
declare class PointVisionSource extends PointEffectSourceMixin(RenderedEffectSource) {
  /** @defaultValue `"sight"` */
  static override sourceType: string;

  /** @defaultValue `["visionMode", "blinded"]` */
  static override _initializeShaderKeys: string[];

  /** @defaultValue `["radius", "color", "attenuation", "brightness", "contrast", "saturation", "visionMode"]` */
  static override _refreshUniformsKeys: string[];

  /**
   * The corresponding lighting levels for dim light.
   * @defaultValue `LIGHTING_LEVELS.DIM`
   */
  protected static _dimLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /**
   * The corresponding lighting levels for bright light.
   * @defaultValue `LIGHTING_LEVELS.BRIGHT`
   */
  protected static _brightLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /** @defaultValue `"visionSources"` */
  static override effectsCollection: string;

  /**
   * @defaultValue
   * ```js
   * ...super.defaultData,
   * contrast: 0,
   * attenuation: 0.5,
   * saturation: 0,
   * brightness: 0,
   * visionMode: "basic",
   * lightRadius: null
   * ```
   */
  static override defaultData: PointVisionSourceData;

  static get _layers(): Record<string, RenderedEffectSource.RenderedEffectLayerConfig>;

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
  get preferred(): boolean;

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

  override _initialize(data: InexactPartial<PointVisionSourceData>): void;

  override _createShapes(): void;

  override shape: PointSourcePolygon;

  /**
   * Responsible for assigning the Vision Mode and calling the activation and deactivation handlers.
   */
  protected _updateVisionMode(): void;

  override _configure(changes: Partial<PointVisionSourceData>): void;

  override _configureLayer(layer: object, layerId: string): void;

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

  override _configureShaders(): {
    background: AdaptiveLightingShader;
    coloration: AdaptiveLightingShader;
    illumination: AdaptiveLightingShader;
  };

  override _updateColorationUniforms(): void;

  override _updateIlluminationUniforms(): void;

  override _updateBackgroundUniforms(): void;

  override _updateCommonUniforms(shader: any): void;
  /**
   * Update layer uniforms according to vision mode uniforms, if any.
   * @param shader     - The shader being updated.
   * @param vmUniforms - The targeted layer.
   */
  protected _updateVisionModeUniforms(shader: AdaptiveVisionShader, vmUniforms: AbstractBaseShader.Uniforms): void;
}

declare namespace PointVisionSource {
  interface VisionSourceData extends RenderedEffectSource.RenderedEffectSourceData {
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
    lightRadius: number;
    /**
     * Is this vision source blinded?
     */
    blinded: boolean;
  }
}

type PointVisionSourceData = PointEffectSourceMixin.PointEffectSourceData &
  RenderedEffectSource.RenderedEffectSourceData;

export default PointVisionSource;
