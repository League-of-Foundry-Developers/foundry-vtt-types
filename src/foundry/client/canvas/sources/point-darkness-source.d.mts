import type { FixedInstanceType, Identity, IntentionalPartial, RequiredProps } from "#utils";
import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type { PointSourceMesh } from "../containers/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of darkness as a point-based effect.
 */
declare class PointDarknessSource<
  SourceData extends PointDarknessSource.SourceData = PointDarknessSource.SourceData,
  SourceShape extends PointSourcePolygon = PointDarknessSource.ConfiguredPolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = PointDarknessSource.Layers,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, RenderingLayers> {
  static override sourceType: "darkness";

  /** @defaultValue `"darknessSources"` */
  static override effectsCollection: string;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.HALFDARK` */
  protected static override _dimLightingLevel: CONST.LIGHTING_LEVELS;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.DARKNESS` */
  protected static override _brightLightingLevel: CONST.LIGHTING_LEVELS;

  /** @defaultValue `CONFIG.Canvas.darknessAnimations` */
  protected static get ANIMATIONS(): typeof CONFIG.Canvas.darknessAnimations;

  /**
   * @defaultValue
   * ```js
   * {
   *   darkness: {
   *     defaultShader: AdaptiveDarknessShader,
   *     blendMode: "MAX_COLOR"
   *   }
   * }
   * ```
   */
  protected static override get _layers(): Record<string, RenderedEffectSource.LayerConfig>;

  /**
   * @remarks See {@linkcode BaseLightSource.defaultData}, {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   * @privateRemarks Not in Foundry code, necessary type override
   */
  static override defaultData: PointDarknessSource.SourceData;

  /**
   * The optional geometric shape is solely utilized for visual representation regarding darkness sources.
   * Used only when an additional radius is added for visuals.
   * @remarks `undefined` prior to initialization
   */
  protected _visualShape: SourceShape | null | undefined;

  /**
   * Padding applied on the darkness source shape for visual appearance only.
   * Note: for now, padding is increased radius. It might evolve in a future release.
   * @defaultValue `(CONFIG.Canvas.darknessSourcePaddingMultiplier ?? 0) * canvas.grid.size`
   */
  protected _padding: number;

  /** @remarks Unconditionally returns `true` for darkness sources */
  override get requiresEdges(): boolean;

  /**
   * A convenience accessor to the darkness layer mesh.
   * @privateRemarks Unlike the other three layer getters inherited from {@linkcode RenderedEffectSource}, this is never undefined
   */
  get darkness(): PointSourceMesh;

  override testPoint(point: Canvas.ElevatedPoint): boolean;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _createShapes(): void;

  protected override _getPolygonConfiguration(): PointDarknessSource.PolygonConfig;

  protected override _drawMesh(layerId: string): PointSourceMesh | null;

  protected override _updateGeometry(): void;

  /**
   * Update the uniforms of the shader on the darkness layer.
   */
  protected _updateDarknessUniforms(): void;

  /**
   * @deprecated "`BaseLightSource#isDarkness` is now obsolete. Use {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource} instead." (since v12, until v14)
   * @remarks Always returns `true`
   */
  get isDarkness(): true;

  #PointDarknessSource: true;
}

declare namespace PointDarknessSource {
  interface Any extends AnyPointDarknessSource {}
  interface AnyConstructor extends Identity<typeof AnyPointDarknessSource> {}

  type Initialized<
    SourceData extends PointDarknessSource.SourceData = PointDarknessSource.SourceData,
    SourceShape extends PointSourcePolygon = PointDarknessSource.ConfiguredPolygon,
    RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = PointDarknessSource.Layers,
  > = PointDarknessSource<SourceData, SourceShape, RenderingLayers> & {
    shape: SourceShape;
    cachedAttenuation: number;
    computedAttenuation: number;
  };

  interface SourceData extends BaseLightSource.SourceData, PointEffectSourceMixin.SourceData {
    /**
     * @privateRemarks Type override only, a darkness source is not going to use a
     * {@linkcode RenderedEffectSource.LightAnimationConfig | LightAnimationConfig}
     */
    animation: RenderedEffectSource.StoredDarknessAnimationConfig;
  }

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold" | "radius"> {}

  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    darkness: RenderedEffectSource.SourceLayer;
  };

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["darknessSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface ConfiguredPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["darkness"]> {}
  interface ConfiguredPolygon extends FixedInstanceType<ConfiguredPolygonClass> {}
}

export default PointDarknessSource;

declare abstract class AnyPointDarknessSource extends PointDarknessSource<
  PointDarknessSource.SourceData,
  PointDarknessSource.ConfiguredPolygon,
  PointDarknessSource.Layers
> {
  constructor(...args: never);
}
