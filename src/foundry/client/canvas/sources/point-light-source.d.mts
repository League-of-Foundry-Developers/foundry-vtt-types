import type {
  AnyObject,
  FixedInstanceType,
  Identity,
  InexactPartial,
  IntentionalPartial,
  Override,
  RequiredProps,
} from "#utils";
import type {
  BaseEffectSource,
  BaseLightSource,
  PointEffectSourceMixin,
  RenderedEffectSource,
} from "#client/canvas/sources/_module.d.mts";
import type { ClockwiseSweepPolygon } from "#client/canvas/geometry/_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { PointSourceMesh } from "#client/canvas/containers/_module.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of light as a point-based effect.
 */
declare class PointLightSource<
  SourceData extends PointLightSource.SourceData = PointLightSource.SourceData,
  SourceShape extends ClockwiseSweepPolygon = PointLightSource.ImplementationPolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = BaseLightSource.Layers,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, RenderingLayers> {
  /** @privateRemarks Actually inherited from {@linkcode BaseLightSource} */
  static override sourceType: "light";

  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /** @privateRemarks Fake override to remove darknessAnimations */
  protected static get ANIMATIONS(): typeof CONFIG.Canvas.lightAnimations;

  /**
   * @remarks See {@linkcode BaseLightSource.defaultData}, {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   * @privateRemarks Fake override to allow merging to this interface but not its parents
   */
  static override defaultData: PointLightSource.SourceData;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  override get requiresEdges(): boolean;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointLightSource.Initialized<SourceData, SourceShape, RenderingLayers>;

  /** @privateRemarks Fake override to reinstate the keyof constraint we lost in the mixin */
  protected _drawMesh(layerId: keyof RenderingLayers): PointSourceMesh | null;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _createShapes(): void;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected override _configure(changes: AnyObject): void;

  protected override _getPolygonConfiguration(): PointLightSource.PolygonConfig;

  /**
   * Test whether this LightSource provides visibility to see a certain target object.
   * @param config - The visibility test configuration
   * @returns Is the target object visible to this source?
   */
  testVisibility(config: CanvasVisibility.TestConfig): boolean;

  /**
   * Can this LightSource theoretically detect a certain object based on its properties?
   * This check should not consider the relative positions of either object, only their state.
   * @param target - The target object being tested
   * @returns Can the target object theoretically be detected by this vision source?
   * @remarks Only returns `false` in core's implementation if `target?.document` is a {@linkcode TokenDocument} with {@linkcode CONFIG.specialStatusEffects.INVISIBLE}
   */
  protected _canDetectObject(target?: CanvasVisibility.TestObject): boolean;

  /**
   * @deprecated "`BaseLightSource#isDarkness` is now obsolete. Use {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource} instead." (since v12, until v14)
   * @remarks Always returns `false`
   * @privateRemarks This isn't actually overridden here; {@linkcode BaseLightSource.isDarkness | BaseLightSource#isDarkness} always returns false, but it's typed as `boolean`
   * there since {@linkcode foundry.canvas.sources.PointDarknessSource | PointDarknessSource#isDarkness} returns true.
   */
  get isDarkness(): false;

  #PointLightSource: true;
}

declare namespace PointLightSource {
  interface Any extends AnyPointLightSource {}
  interface AnyConstructor extends Identity<typeof AnyPointLightSource> {}

  type Initialized<
    SourceData extends PointLightSource.SourceData = PointLightSource.SourceData,
    SourceShape extends ClockwiseSweepPolygon = PointLightSource.ImplementationPolygon,
    RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = BaseLightSource.Layers,
  > = Override<
    PointLightSource<SourceData, SourceShape, RenderingLayers>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape;
    }
  >;

  interface SourceData extends PointEffectSourceMixin.SourceData, BaseLightSource.SourceData {}

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold"> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["lightSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface ImplementationPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["light"]> {}
  interface ImplementationPolygon extends FixedInstanceType<ImplementationPolygonClass> {}
}

export default PointLightSource;

declare abstract class AnyPointLightSource extends PointLightSource<
  PointLightSource.SourceData,
  ClockwiseSweepPolygon,
  BaseLightSource.Layers
> {
  constructor(...args: never);
}
