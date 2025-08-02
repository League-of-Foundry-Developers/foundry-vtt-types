import type { FixedInstanceType, Identity, InexactPartial, Override, RequiredProps } from "#utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { ClockwiseSweepPolygon } from "#client/canvas/geometry/_module.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
declare class PointSoundSource<
  SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
  SourceShape extends ClockwiseSweepPolygon = PointSoundSource.ImplementationPolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  static override sourceType: "sound";

  /**
   * @remarks See {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   * @privateRemarks Fake override to allow merging to this interface but not its parents
   */
  static override defaultData: PointSoundSource.SourceData;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointSoundSource.Initialized<SourceData, SourceShape>;

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
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPointSoundSource {}
    interface AnyConstructor extends Identity<typeof AnyPointSoundSource> {}
  }

  type Initialized<
    SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
    SourceShape extends ClockwiseSweepPolygon = PointSoundSource.ImplementationPolygon,
  > = Override<
    PointSoundSource<SourceData, SourceShape>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape;
    }
  >;

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

  interface ImplementationPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["sound"]> {}
  interface ImplementationPolygon extends FixedInstanceType<ImplementationPolygonClass> {}
}

export default PointSoundSource;

declare abstract class AnyPointSoundSource extends PointSoundSource<
  PointSoundSource.SourceData,
  ClockwiseSweepPolygon
> {
  constructor(...args: never);
}
