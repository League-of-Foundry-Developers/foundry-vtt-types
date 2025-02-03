import type { NullishProps } from "fvtt-types/utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
declare class PointSoundSource<
  SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  /** @defaultValue `"sound"` */
  static override sourceType: string;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;

  override get effectsCollection(): Collection<this>;

  override _getPolygonConfiguration(): PointSourcePolygon.Config;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   */
  getVolumeMultiplier(
    listener: Canvas.Point,
    options?: NullishProps<{
      /** If no easing, return `1` */
      easing: boolean;
    }>,
  ): number;
}

declare namespace PointSoundSource {
  type AnyConstructor = typeof AnyPointSoundSource;

  type SourceData = PointEffectSourceMixin.MixedSourceData;
}

declare abstract class AnyPointSoundSource extends PointSoundSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointSoundSource;
