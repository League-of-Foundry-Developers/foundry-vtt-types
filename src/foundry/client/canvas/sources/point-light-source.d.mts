import type { AnyObject, FixedInstanceType, Identity, IntentionalPartial, RequiredProps } from "#utils";
import type {
  BaseLightSource,
  PointEffectSourceMixin,
  RenderedEffectSource,
} from "#client/canvas/sources/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of light as a point-based effect.
 */
declare class PointLightSource<
  SourceData extends PointLightSource.SourceData = PointLightSource.SourceData,
  SourceShape extends PointSourcePolygon = PointLightSource.ConfiguredPolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = BaseLightSource.Layers,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, RenderingLayers> {
  /** @privateRemarks Actually inherited from {@linkcode BaseLightSource} */
  static override sourceType: "light";

  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /** @privateRemarks Not in Foundry code, necessary type override */
  static override defaultData: PointLightSource.SourceData;

  override get requiresEdges(): boolean;

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
   */
  protected _canDetectObject(target?: PlaceableObject.Any | null): boolean;

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

  interface SourceData extends PointEffectSourceMixin.SourceData, BaseLightSource.SourceData {
    animation: RenderedEffectSource.StoredLightAnimationConfig;
  }

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold"> {}

  // TODO: make configurable
  interface ImplementationClass extends Identity<CONFIG["Canvas"]["lightSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  // TODO: make configurable
  interface ConfiguredPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["light"]> {}
  interface ConfiguredPolygon extends FixedInstanceType<ConfiguredPolygonClass> {}
}

export default PointLightSource;

declare abstract class AnyPointLightSource extends PointLightSource<
  PointLightSource.SourceData,
  PointSourcePolygon,
  BaseLightSource.Layers
> {
  constructor(...args: never);
}
