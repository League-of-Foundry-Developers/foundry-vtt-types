import BaseEffectSource from "./base-effect-source.mjs";
import PointEffectSourceMixin from "./point-effect-source.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
export default class PointSoundSource extends PointEffectSourceMixin(BaseEffectSource) {
  /** @defaultValue `"sound"` */
  static override sourceType: string;

  override get effectsCollection(): Collection<this>;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   */
  getVolumeMultiplier(
    listener: Point,
    options?: {
      easing?: boolean;
    },
  ): number;
}
