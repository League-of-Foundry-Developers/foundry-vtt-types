import type { InexactPartial } from "../../../../types/utils.d.mts";
import BaseLightSource from "./base-light-source.mts";
import type { PointEffectSourceMixin_BaseLightSource_Interface } from "./point-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

declare const MixedPointBaseLightSource: PointEffectSourceMixin_BaseLightSource_Interface;

/**
 * A specialized subclass of the BaseLightSource which renders a source of light as a point-based effect.
 */
export default class PointLightSource<
  SourceShape extends BaseLightSource.LightSourceData,
> extends MixedPointBaseLightSource<SourceShape> {
  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  override _initialize(data: InexactPartial<PointLightSourceData>): void;

  override _createShapes(): void;

  override _configure(changes: Partial<PointLightSourceData>): void;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Test whether this LightSource provides visibility to see a certain target object.
   * @param config - The visibility test configuration
   * @returns Is the target object visible to this source?
   */
  testVisibility(config?: {
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

type PointLightSourceData = PointEffectSourceMixin.PointEffectSourceData & BaseLightSource.LightSourceData;
