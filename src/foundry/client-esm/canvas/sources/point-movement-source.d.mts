import BaseEffectSource from "./base-effect-source.mts";
import PointEffectSourceMixin from "./point-effect-source.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
export default class PointMovementSource extends PointEffectSourceMixin(BaseEffectSource) {
  /** @defaultValue `"move"` */
  static override sourceType: string;
}
