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
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = RenderedEffectSource.Layers,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, RenderingLayers> {
  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /** @privateRemarks Not in Foundry code, necessary type override */
  static override defaultData: PointLightSource.SourceData;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;

  protected override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _createShapes(): void;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected override _configure(changes: AnyObject): void;

  protected override _getPolygonConfiguration(): PointLightSource.PolygonConfig;

  /**
   * Test whether this LightSource provides visibility to see a certain target object.
   * @param config - The visibility test configuration
   * @returns Is the target object visible to this source?
   * @remarks Despite being an `={}` parameter, this will error if `config.tests` is not at least an empty array of `CanvasVisibility.Test`s
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
   * @deprecated since v12, until v14
   * @remarks `"BaseLightSource#isDarkness is now obsolete. Use DarknessSource instead."`
   *
   * Always returns `false`
   * @privateRemarks This isn't actually overridden here, `BaseLightSource#isDarkness` always returns false, but it's type as `boolean` there to allow `PointDarknessSource#isDarkness` to return true.
   */
  get isDarkness(): false;
}

declare namespace PointLightSource {
  interface Any extends AnyPointLightSource {}
  interface AnyConstructor extends Identity<typeof AnyPointLightSource> {}

  interface SourceData extends PointEffectSourceMixin.SourceData, BaseLightSource.SourceData {
    animation: RenderedEffectSource.StoredLightAnimationConfig;
  }

  interface PolygonConfig
    extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold" | "includeDarkness"> {}

  type ConfiguredClass = CONFIG["Canvas"]["lightSourceClass"];
  type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;
}

declare abstract class AnyPointLightSource extends PointLightSource<
  PointLightSource.SourceData,
  PointSourcePolygon,
  RenderedEffectSource.Layers
> {
  constructor(...args: never);
}

export default PointLightSource;
