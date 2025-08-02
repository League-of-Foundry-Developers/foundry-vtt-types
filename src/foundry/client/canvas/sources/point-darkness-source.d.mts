import type { FixedInstanceType, Identity, InexactPartial, IntentionalPartial, Override, RequiredProps } from "#utils";
import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type { PointSourceMesh } from "../containers/_module.d.mts";
import type { ClockwiseSweepPolygon } from "#client/canvas/geometry/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of darkness as a point-based effect.
 */
declare class PointDarknessSource<
  SourceData extends PointDarknessSource.SourceData = PointDarknessSource.SourceData,
  SourceShape extends ClockwiseSweepPolygon = PointDarknessSource.ImplementationPolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = PointDarknessSource.Layers,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, RenderingLayers> {
  static override sourceType: "darkness";

  /** @defaultValue `"darknessSources"` */
  static override effectsCollection: string;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.HALFDARK` */
  protected static override _dimLightingLevel: CONST.LIGHTING_LEVELS;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.DARKNESS` */
  protected static override _brightLightingLevel: CONST.LIGHTING_LEVELS;

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
   * @privateRemarks Fake override to allow merging to this interface but not its parents
   */
  static override defaultData: PointDarknessSource.SourceData;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  /**
   * The optional geometric shape is solely utilized for visual representation regarding darkness sources.
   * Used only when an additional radius is added for visuals.
   * @remarks Is `undefined` prior to initialization.
   *
   * Not included in the {@linkcode PointDarknessSource.Initialized} overrides,
   * because it being protected makes overriding messy, and it will still include `| null`; removing the `| undefined` doesn't
   * meaningfully change the ergonomics
   */
  protected _visualShape: SourceShape | null | undefined;

  /**
   * Padding applied on the darkness source shape for visual appearance only.
   * Note: for now, padding is increased radius. It might evolve in a future release.
   * @defaultValue `(CONFIG.Canvas.darknessSourcePaddingMultiplier ?? 0) * canvas.grid.size`
   */
  protected _padding: number;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointDarknessSource.Initialized<SourceData, SourceShape, RenderingLayers>;

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

  protected override _drawMesh(layerId: keyof RenderingLayers): PointSourceMesh | null;

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
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPointDarknessSource {}
    interface AnyConstructor extends Identity<typeof AnyPointDarknessSource> {}
  }

  type Initialized<
    SourceData extends PointDarknessSource.SourceData = PointDarknessSource.SourceData,
    SourceShape extends ClockwiseSweepPolygon = PointDarknessSource.ImplementationPolygon,
    RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = PointDarknessSource.Layers,
  > = Override<
    PointDarknessSource<SourceData, SourceShape, RenderingLayers>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape;

      // `protected _visualShape` not overridden because it being protected makes overriding messy, and it will
      // still include `| null`; removing the `| undefined` doesn't meaningfully change the ergonomics
    }
  >;

  interface SourceData extends BaseLightSource.SourceData, PointEffectSourceMixin.SourceData {}

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold" | "radius"> {}

  /** @remarks See {@linkcode PointDarknessSource._layers} */
  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    darkness: RenderedEffectSource.SourceLayer;
  };

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["darknessSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface ImplementationPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["darkness"]> {}
  interface ImplementationPolygon extends FixedInstanceType<ImplementationPolygonClass> {}
}

export default PointDarknessSource;

declare abstract class AnyPointDarknessSource extends PointDarknessSource<
  PointDarknessSource.SourceData,
  ClockwiseSweepPolygon,
  PointDarknessSource.Layers
> {
  constructor(...args: never);
}
