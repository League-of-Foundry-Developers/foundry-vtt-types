import type { FixedInstanceType, NullishProps } from "fvtt-types/utils";
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
   * @remarks If `listener` is falsey, returns `0`. If `options.easing` is falsey, returns `1`
   */
  getVolumeMultiplier(listener?: Canvas.Point | null, options?: PointSoundSource.GetVolumeMultiplierOptions): number;
}

declare namespace PointSoundSource {
  interface Any extends AnyPointSoundSource {}
  type AnyConstructor = typeof AnyPointSoundSource;

  /** @internal */
  type _GetVolumeMultiplierOptions = NullishProps<{
    /**
     * @defaultValue `true`
     * @remarks If `false`, return `1`
     */
    easing: boolean;
  }>;

  interface GetVolumeMultiplierOptions extends _GetVolumeMultiplierOptions {}

  type SourceData = PointEffectSourceMixin.MixedSourceData;

  type ConfiguredClass = CONFIG["Canvas"]["soundSourceClass"];
  type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;
}

declare abstract class AnyPointSoundSource extends PointSoundSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointSoundSource;
