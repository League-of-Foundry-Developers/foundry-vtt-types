import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

type LightSourceData = PointEffectSourceMixin.SourceData & BaseLightSource.SourceData;

/**
 * A specialized subclass of the BaseLightSource which renders a source of light as a point-based effect.
 */
export default class PointLightSource<
  SourceData extends LightSourceData = LightSourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape> {
  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  override _initialize(data: Partial<SourceData>): void;

  override _createShapes(): void;

  override _configure(changes: Partial<SourceData>): void;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Test whether this LightSource provides visibility to see a certain target object.
   * @param config - The visibility test configuration
   * @returns Is the target object visible to this source?
   */
  testVisibility(config: {
    /** The sequence of tests to perform */
    tests: CanvasVisibilityTest[];
    /** The target object being tested */
    object: PlaceableObject;
  }): boolean;

  /**
   * Can this LightSource theoretically detect a certain object based on its properties?
   * This check should not consider the relative positions of either object, only their state.
   * @param target - The target object being tested
   * @returns Can the target object theoretically be detected by this vision source?
   */
  _canDetectObject(target: PlaceableObject): boolean;
}
