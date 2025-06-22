import type { FixedInstanceType, Identity, InexactPartial, RequiredProps } from "#utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
declare class PointSoundSource<
  SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSoundSource.ConfiguredPolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  static override sourceType: "sound";

  /** @privateRemarks Not in Foundry code, necessary type override */
  static override defaultData: PointSoundSource.SourceData;

  override get effectsCollection(): Collection<this>;

  override _getPolygonConfiguration(): PointSoundSource.PolygonConfig;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   */
  getVolumeMultiplier(listener: Canvas.ElevatedPoint, options?: PointSoundSource.GetVolumeMultiplierOptions): number;

  /**
   * Get the effective volume at which an AmbientSound source should be played for a certain listener.
   * @deprecated "PointSoundSource#getVolumeMultiplier({@linkcode Canvas.Point | Point}) has been deprecated in favor of
   * PointSoundSource#getVolumeMultiplier({@linkcode Canvas.ElevatedPoint | ElevatedPoint})." (since v13, until v15)
   */
  getVolumeMultiplier(listener: Canvas.Point, options?: PointSoundSource.GetVolumeMultiplierOptions): number;
}

declare namespace PointSoundSource {
  interface Any extends AnyPointSoundSource {}
  interface AnyConstructor extends Identity<typeof AnyPointSoundSource> {}

  type Initialized<
    SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
    SourceShape extends PointSourcePolygon = PointSoundSource.ConfiguredPolygon,
  > = PointSoundSource<SourceData, SourceShape> & { shape: SourceShape };

  /** @internal */
  type _GetVolumeMultiplierOptions = InexactPartial<{
    /** @defaultValue `true` */
    easing: boolean;
  }>;

  interface GetVolumeMultiplierOptions extends _GetVolumeMultiplierOptions {}

  interface SourceData extends PointEffectSourceMixin.MixedSourceData {}

  interface PolygonConfig extends RequiredProps<PointEffectSourceMixin.PolygonConfig, "useThreshold"> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["soundSourceClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface ConfiguredPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["sound"]> {}
  interface ConfiguredPolygon extends FixedInstanceType<ConfiguredPolygonClass> {}
}

export default PointSoundSource;

declare abstract class AnyPointSoundSource extends PointSoundSource<
  PointSoundSource.SourceData,
  PointSoundSource.ConfiguredPolygon
> {
  constructor(...args: never);
}
