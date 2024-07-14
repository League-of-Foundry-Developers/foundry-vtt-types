import type BaseEffectSource from "./base-effect-source.d.mts";
import PointEffectSourceMixin, {
  type PointEffectSourceMixin_BaseEffectSource_Interface,
} from "./point-effect-source.mts";

declare const PointEffectSourceMixin_BaseEffectSource: PointEffectSourceMixin_BaseEffectSource_Interface;

type MovementSourceData = PointEffectSourceMixin.PointEffectSourceData & BaseEffectSource.BaseEffectSourceData;

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
export default class PointMovementSource<
  SourceData extends MovementSourceData = MovementSourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin_BaseEffectSource<SourceData, SourceShape> {
  /** @defaultValue `"move"` */
  static override sourceType: string;
}
