import type { FixedInstanceType, Identity, InexactPartial, IntentionalPartial, Override, RequiredProps } from "#utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { ClockwiseSweepPolygon } from "#client/canvas/geometry/_module.d.mts";
import type { Sound } from "#client/audio/_module.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a point-based source of sound.
 */
declare class PointSoundSource<
  SourceData extends PointSoundSource.SourceData = PointSoundSource.SourceData,
  SourceShape extends ClockwiseSweepPolygon = PointSoundSource.ImplementationPolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  static override sourceType: "sound";

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   path: null,
   *   volume: 1,
   *   easing: true,
   *   effects: {base: {}, muffled: {}}
   * }
   * ```
   * @remarks See {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   */
  static override defaultData: PointSoundSource.SourceData;

  /**
   * The Sound instance which this source drives.
   * @defaultValue `null`
   */
  sound: Sound | null;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointSoundSource.Initialized<SourceData, SourceShape>;

  override get effectsCollection(): Collection<this>;

  /**
   * Update the set of effects which are applied to the managed Sound.
   * @remarks
   * @throws If {@linkcode PointSoundSource.sound | #sound} is `null`
   */
  applyEffects(options?: PointSoundSource.ApplyEffectsOptions): void;

  protected override _destroy(): void;

  /**
   * Release a Sound which no longer matches the configured audio path so that a new one is acquired on the next sync.
   */
  protected override _initialize(data: IntentionalPartial<SourceData>): void;

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

  /**
   * Discard prepared effect nodes so that they are rebuilt from current source data.
   */
  resetEffects(): void;

  /**
   * Toggle playback of the Sound driven by this source, adjusting its volume and effects.
   * @param isAudible - Should the sound be playing?
   * @param volume    - The target playback volume
   * @remarks `volume` can be omitted when stopping playback. It is required when the
   * sound may be audible, since a playing sound passes it to {@linkcode Sound.fade | Sound#fade}.
   */
  sync(isAudible: false, volume?: number, options?: PointSoundSource.SyncOptions): Promise<void>;
  sync(isAudible: boolean, volume: number, options?: PointSoundSource.SyncOptions): Promise<void>;

  #PointSoundSource: true;
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
  interface _GetVolumeMultiplierOptions {
    /** @defaultValue `true` */
    easing: boolean;
  }

  interface GetVolumeMultiplierOptions extends InexactPartial<_GetVolumeMultiplierOptions> {}

  interface SourceData extends PointEffectSourceMixin.MixedSourceData {
    /**
     * @defaultValue `null`
     * @remarks The audio path of the {@linkcode PointSoundSource.sound | #sound} this source drives
     */
    path: string | null;

    /** @defaultValue `1` */
    volume: number;

    /** @defaultValue `true` */
    easing: boolean;

    /** @defaultValue `{ base: {}, muffled: {} }` */
    effects: Effects;
  }

  interface Effects {
    base: Sound.EffectConfig;

    /** @remarks Falls back to `base` if no effect is created from this config */
    muffled: Sound.EffectConfig;
  }

  interface ApplyEffectsOptions {
    /**
     * Is the sound currently muffled?
     * @defaultValue `false`
     */
    muffled?: boolean | undefined;
  }

  interface SyncOptions extends ApplyEffectsOptions {
    /**
     * Duration of volume transitions in milliseconds
     * @defaultValue `250`
     */
    fade?: number | undefined;
  }

  interface PartialSourceData extends InexactPartial<SourceData> {}

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
