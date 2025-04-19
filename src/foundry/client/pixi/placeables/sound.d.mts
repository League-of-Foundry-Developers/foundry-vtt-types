import type Sound from "../../../client-esm/audio/sound.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type {
  FixedInstanceType,
  HandleEmptyObject,
  InexactPartial,
  IntentionalPartial,
  NullishProps,
  RequiredProps,
} from "fvtt-types/utils";

declare global {
  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   * @see {@link AmbientSoundDocument | `AmbientSoundDocument`}
   * @see {@link SoundsLayer | `SoundsLayer`}
   */
  class AmbientSound extends PlaceableObject<AmbientSoundDocument.Implementation> {
    constructor(document: AmbientSoundDocument.Implementation);

    /**
     * The Sound which manages playback for this AmbientSound effect
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to {@link AmbientSound.sync | `AmbientSound#sync`}
     * or {@link AmbientSound._onUpdate | `AmbientSound#_onUpdate`} being called (the
     * former likely via {@link SoundsLayer._syncPositions | `SoundsLayer#_syncPositions`})
     *
     * Set `null` if this sound's document has either no `path` or no `id` (e.g if its a preview, for the latter)
     */
    sound: Sound | null | undefined;

    /**
     * A SoundSource object which manages the area of effect for this ambient sound
     * @remarks Not initialized to a value in the class body, but {@link AmbientSound._onCreate | `AmbientSound#_onCreate`}
     * calls {@link AmbientSound.initializeSoundSource | `AmbientSound.initializeSoundSource`}.
     *
     * Set `undefined` by {@link AmbientSound._destroy | `AmbientSound#_destroy`}.
     */
    source: foundry.canvas.sources.PointSoundSource.ConfiguredInstance | undefined;

    /**
     * The area that is affected by this ambient sound.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    field: PIXI.Graphics | undefined;

    static override embeddedName: "AmbientSound";

    static override RENDER_FLAGS: AmbientSound.RENDER_FLAGS;

    /**
     * Create a Sound used to play this AmbientSound object
     */
    protected _createSound(): Sound | null;

    /**
     * Update the set of effects which are applied to the managed Sound.
     */
    // options: not null (destructured)
    applyEffects(options?: AmbientSound.ApplyEffectsOptions): void;

    /**
     * Is this ambient sound is currently audible based on its hidden state and the darkness level of the Scene?
     */
    get isAudible(): boolean;

    override get bounds(): PIXI.Rectangle;

    /**
     * A convenience accessor for the sound radius in pixels
     */
    get radius(): number;

    /**
     * Toggle playback of the sound depending on whether or not it is audible
     * @param isAudible - Is the sound audible?
     * @param volume    - The target playback volume
     * @param options   - Additional options which affect sound synchronization
     */
    // options: not null (destructured)
    sync(isAudible: boolean, volume: number, options?: AmbientSound.SyncOptions): void;

    override clear(): this;

    protected override _draw(options: HandleEmptyObject<AmbientSound.DrawOptions>): Promise<void>;

    protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

    protected _applyRenderFlags(flags: AmbientSound.RenderFlags): void;

    /**
     * Refresh the shape of the sound field-of-effect. This is refreshed when the SoundSource fov polygon changes.
     */
    protected _refreshField(): void;

    /**
     * Refresh the position of the AmbientSound. Called with the coordinates change.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the state of the light. Called when the disabled state or darkness conditions change.
     */
    protected _refreshState(): void;

    /**
     * Refresh the display of the ControlIcon for this AmbientSound source
     */
    refreshControl(): void;

    /**
     * Refresh the elevation of the control icon.
     */
    protected _refreshElevation(): void;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @param options - Options which modify how the audio source is updated
     */
    // options: not null (destructured)
    initializeSoundSource(options?: AmbientSound.InitializeSoundSourceOptions): void;

    /**
     * Get the sound source data.
     */
    protected _getSoundSourceData(): AmbientSound.SoundSourceData;

    // _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    protected override _canHUD(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    /** @remarks Always returns `false` ("Double-right does nothing") */
    protected override _canConfigure(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    // options: not null (destructured)
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragEnd(): void;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[];

    /**
     * @deprecated since v12, until v14
     * @remarks "`AmbientSound#updateSource` has been deprecated in favor of {@link AmbientSound.initializeSoundSource | `AmbientSound#initializeSoundSource`}"
     *
     * @privateRemarks The `defer` parameter exists in this signature but is not used by `#initializeSoundSource`, so we can just reuse that method's options interface
     */
    updateSource(options?: AmbientSound.InitializeSoundSourceOptions): void;
  }

  namespace AmbientSound {
    // eslint-disable-next-line no-restricted-syntax
    type ObjectClass = ConfiguredObjectClassOrDefault<typeof AmbientSound>;
    type Object = FixedInstanceType<ObjectClass>;

    /**
     * @deprecated {@link AmbientSound.ObjectClass | `AmbientSound.ObjectClass`}
     */
    type ConfiguredClass = ObjectClass;

    /**
     * @deprecated {@link AmbientSound.Object | `AmbientSound.Object`}
     */
    type ConfiguredInstance = Object;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `AmbientSound` (the `PlaceableObject` that appears on the canvas) and
     * `AmbientSoundDocument` (the `Document` that represents the data for a `AmbientSound`) is so common that
     * it is useful to have a type to forward to `AmbientSoundDocument`.
     *
     * @deprecated {@link AmbientSoundDocument.Implementation | `AmbientSoundDocument.Implementation`}
     */
    type Implementation = AmbientSoundDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `AmbientSound` (the `PlaceableObject` that appears on the canvas) and
     * `AmbientSoundDocument` (the `Document` that represents the data for a `AmbientSound`) is so common that
     * it is useful to have a type to forward to `AmbientSoundDocument`.
     *
     * @deprecated {@link AmbientSoundDocument.ImplementationClass | `AmbientSoundDocument.ImplementationClass`}
     */
    type ImplementationClass = AmbientSoundDocument.ImplementationClass;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshField", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshPosition"] }` */
      refreshField: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    /** @internal */
    type _ApplyEffectsOptions = NullishProps<{
      /**
       * Is the sound currently muffled?
       * @defaultValue `false`
       */
      muffled: boolean;
    }>;

    interface ApplyEffectsOptions extends _ApplyEffectsOptions {}

    /** @internal */
    type _SyncOptions = InexactPartial<{
      /**
       * A duration in milliseconds to fade volume transition
       * @defaultValue `250`
       * @remarks Can't be `null` as it only has a parameter default
       */
      fade: number;
    }>;

    interface SyncOptions extends _SyncOptions, _ApplyEffectsOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    /**
     * @internal */
    type _InitializeSoundSourceOptions = NullishProps<{
      /**
       * Indicate that this SoundSource has been deleted.
       * @defaultValue `false`
       */
      deleted: boolean;
    }>;

    interface InitializeSoundSourceOptions extends _InitializeSoundSourceOptions {}

    /**
     * @remarks The return of {@link AmbientSound._getSoundSourceData | `AmbientSound#_getSoundSourceData`}, which gets passed
     * to {@link foundry.canvas.sources.PointSoundSource.initialize | `AmbientSound#source#initialize()`}, so this is a
     * `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
     */
    type SoundSourceData = RequiredProps<
      IntentionalPartial<foundry.canvas.sources.PointSoundSource.SourceData>,
      "x" | "y" | "elevation" | "radius" | "walls" | "disabled"
    >;
  }
}
