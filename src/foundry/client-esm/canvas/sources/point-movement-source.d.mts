import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

type MovementSourceData = PointEffectSourceMixin.SourceData & BaseEffectSource.SourceData;

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
export default class PointMovementSource<
  SourceData extends MovementSourceData = MovementSourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  /** @defaultValue `"move"` */
  static override sourceType: string;
}
