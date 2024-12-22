import type { IntentionalPartial } from "../../../../types/helperTypes.d.mts";
import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of light as a point-based effect.
 */
declare class PointLightSource<
  SourceData extends PointLightSource.SourceData = PointLightSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape> {
  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;

  override _initialize(data: IntentionalPartial<SourceData>): void;

  override _createShapes(): void;

  override _configure(changes: IntentionalPartial<SourceData>): void;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Test whether this LightSource provides visibility to see a certain target object.
   * @param config - The visibility test configuration
   * @returns Is the target object visible to this source?
   */
  testVisibility(config?: CanvasVisibilityTestConfig): boolean;

  /**
   * Can this LightSource theoretically detect a certain object based on its properties?
   * This check should not consider the relative positions of either object, only their state.
   * @param target - The target object being tested
   * @returns Can the target object theoretically be detected by this vision source?
   */
  _canDetectObject(target?: PlaceableObject | null): boolean;
}

declare namespace PointLightSource {
  type AnyConstructor = typeof AnyPointLightSource;

  type SourceData = PointEffectSourceMixin.SourceData & BaseLightSource.SourceData;
}

declare abstract class AnyPointLightSource extends PointLightSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointLightSource;
