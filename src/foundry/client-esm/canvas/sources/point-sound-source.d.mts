import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

type SoundSourceData = PointEffectSourceMixin.PointEffectSourceData & BaseEffectSource.BaseEffectSourceData;

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
export default class PointSoundSource<
  SourceData extends SoundSourceData = SoundSourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  /** @defaultValue `"sound"` */
  static override sourceType: string;

  override get effectsCollection(): Collection<this>;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   */
  getVolumeMultiplier(
    listener: Canvas.Point,
    options?: {
      easing?: boolean | undefined;
    },
  ): number;
}
