import type { HandleEmptyObject, InexactPartial, NullishProps } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   * @see {@link AmbientSoundDocument}
   * @see {@link SoundsLayer}
   */
  class AmbientSound<
    ControlOptions extends AmbientSound.ControlOptions = AmbientSound.ControlOptions,
    DestroyOptions extends AmbientSound.DestroyOptions | boolean = AmbientSound.DestroyOptions | boolean,
    DrawOptions extends AmbientSound.DrawOptions = AmbientSound.DrawOptions,
    ReleaseOptions extends AmbientSound.ReleaseOptions = AmbientSound.ReleaseOptions,
  > extends PlaceableObject<
    AmbientSoundDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    constructor(document: AmbientSoundDocument.ConfiguredInstance);

    /**
     * The Sound which manages playback for this AmbientSound effect
     */
    sound: foundry.audio.Sound | null | undefined;

    /**
     * A SoundSource object which manages the area of effect for this ambient sound
     */
    source: foundry.canvas.sources.PointSoundSource | undefined;

    /**
     * The area that is affected by this ambient sound.
     */
    field: PIXI.Graphics | undefined;

    static override embeddedName: "AmbientSound";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<AmbientSound.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshField", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<Partial<AmbientSound.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition"] }` */
      refreshField: RenderFlag<Partial<AmbientSound.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<Partial<AmbientSound.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<Partial<AmbientSound.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<Partial<AmbientSound.RenderFlags>>;
    };

    /**
     * Create a Sound used to play this AmbientSound object
     */
    protected _createSound(): ReturnType<foundry.audio.AudioHelper["create"]> | null;

    /**
     * Update the set of effects which are applied to the managed Sound.
     */
    applyEffects(
      options?: NullishProps<{
        /**
         * Is the sound currently muffled?
         * @defaultValue `false`
         */
        muffled: boolean;
      }>,
    ): void;

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
     * @remarks Options can't be NullishProps because a default for `fade` is only provided by `{fade=250}` and it's passed on to `Sound#stop`
     */
    sync(isAudible: boolean, volume: number, options?: InexactPartial<AmbientSound.SyncOptions>): void;

    override clear(): this;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    protected override _destroy(options?: DestroyOptions): void;

    protected _applyRenderFlags(flags: NullishProps<AmbientSound.RenderFlags>): void;

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
    initializeSoundSource(
      options?: NullishProps<{
        /**
         * Indicate that this SoundSource has been deleted.
         * @defaultValue `false`
         */
        deleted: boolean;
      }>,
    ): void;

    /**
     * Get the light source data.
     */
    protected _getLightSourceData(): foundry.data.LightData;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragEnd(): void;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @param options - (default: `{}`)
     * @deprecated since v12, until v14
     * @remarks "AmbientSound#updateSource has been deprecated in favor of AmbientSound#initializeSoundSource"
     */
    updateSource(
      options?: NullishProps<{
        /**
         * Defer refreshing the SoundsLayer to manually call that refresh later.
         * @defaultValue `false`
         * @remarks Non-functional since the deprecation
         */
        defer?: boolean | undefined;

        /**
         * Indicate that this SoundSource has been deleted.
         * @defaultValue `false`
         */
        deleted?: boolean | undefined;
      }>,
    ): void;
  }

  namespace AmbientSound {
    type AnyConstructor = typeof AnyAmbientSound;

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof AmbientSound>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshField: boolean;

      refreshPosition: boolean;

      refreshElevation: boolean;
    }

    interface SyncOptions {
      /**
       * Is the sound current muffled?
       * @defaultValue `false`
       */
      muffled: boolean;

      /**
       * A duration in milliseconds to fade volume transition
       * @defaultValue `250`
       */
      fade: number;
    }
  }
}

declare abstract class AnyAmbientSound extends AmbientSound {
  constructor(arg0: never, ...args: never[]);
}
