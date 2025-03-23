import type { Identity } from "../../../../utils/index.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
declare class PointMovementSource<
  SourceData extends PointMovementSource.SourceData = PointMovementSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  /** @defaultValue `"move"` */
  static override sourceType: string;

  /** @privateRemarks Not in Foundry code, necessary type override */
  static override defaultData: PointMovementSource.SourceData;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;
}

declare namespace PointMovementSource {
  interface Any extends AnyPointMovementSource {}
  interface AnyConstructor extends Identity<typeof AnyPointMovementSource> {}

  interface SourceData extends PointEffectSourceMixin.MixedSourceData {}

  // This is the only core Point*Source class that isn't configurable, `Token##getMovementSource`
  // references this class directly, not a `CONFIG` property
}

declare abstract class AnyPointMovementSource extends PointMovementSource<
  PointMovementSource.SourceData,
  PointSourcePolygon
> {
  constructor(...args: never);
}

export default PointMovementSource;
