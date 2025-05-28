import type { FixedInstanceType, Identity, NullishProps, RequiredProps } from "#utils";
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

  /** @privateRemarks Not in Foundry code, necessary type override */
  static override defaultData: PointSoundSource.SourceData;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;

  override get effectsCollection(): foundry.utils.Collection<this>;

  override _getPolygonConfiguration(): PointSoundSource.PolygonConfig;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   * @remarks If `listener` is falsey, returns `0`. If `options.easing` is falsey, returns `1`
   */
  getVolumeMultiplier(listener?: Canvas.Point | null, options?: PointSoundSource.GetVolumeMultiplierOptions): number;
}

declare namespace PointSoundSource {
  interface Any extends AnyPointSoundSource {}
  interface AnyConstructor extends Identity<typeof AnyPointSoundSource> {}

  /** @internal */
  type _GetVolumeMultiplierOptions = NullishProps<{
    /**
     * @defaultValue `true`
     * @remarks If `false`, return `1`
     */
    easing: boolean;
  }>;

  interface GetVolumeMultiplierOptions extends _GetVolumeMultiplierOptions {}

  interface SourceData extends PointEffectSourceMixin.MixedSourceData {}

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold"> {}

  type ConfiguredClass = CONFIG["Canvas"]["soundSourceClass"];
  type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;
}

declare abstract class AnyPointSoundSource extends PointSoundSource<PointSoundSource.SourceData, PointSourcePolygon> {
  constructor(...args: never);
}

export default PointSoundSource;
