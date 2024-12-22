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

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;
}

declare namespace PointMovementSource {
  type AnyConstructor = typeof AnyPointMovementSource;

  type SourceData = PointEffectSourceMixin.MixedSourceData;
}

declare abstract class AnyPointMovementSource extends PointMovementSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointMovementSource;
