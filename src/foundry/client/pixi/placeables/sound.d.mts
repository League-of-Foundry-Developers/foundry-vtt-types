import type Sound from "../../../client-esm/audio/sound.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType } from "fvtt-types/utils";

declare global {
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

      /** @defaultValue `{ propagate: ["refreshField"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshState"] }` */
      refreshField: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface SyncOptions {
      /**
       * A duration in milliseconds to fade volume transition
       * @defaultValue `250`
       */
      fade: number;
    }

    interface UpdateSourceOptions {
      /**
       * Defer refreshing the SoundsLayer to manually call that refresh later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this SoundSource has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;
    }
  }

  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   * @see {@link AmbientSoundDocument | `AmbientSoundDocument`}
   * @see {@link SoundsLayer | `SoundsLayer`}
   */
  class AmbientSound extends PlaceableObject<AmbientSoundDocument.Implementation> {
    constructor(document: AmbientSoundDocument.Implementation);

    /**
     * The Sound which manages playback for this AmbientSound effect
     */
    sound: Sound | null;

    /**
     * A SoundSource object which manages the area of effect for this ambient sound
     */
    source: foundry.canvas.sources.PointSoundSource;

    static override embeddedName: "AmbientSound";

    static override RENDER_FLAGS: AmbientSound.RENDER_FLAGS;

    /**
     * Is this ambient sound is currently audible based on its hidden state and the darkness level of the Scene?
     */
    get isAudible(): boolean;

    override get bounds(): PIXI.Rectangle;

    /**
     * The named identified for the source object associated with this ambient sound
     */
    get sourceId(): string;

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
    sync(isAudible: boolean, volume: number, options?: Partial<AmbientSound.SyncOptions>): void;

    override clear(): this;

    protected override _draw(): Promise<void>;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected _applyRenderFlags(flags: AmbientSound.RenderFlags): void;

    /**
     * Refresh the display of the ControlIcon for this AmbientSound source
     */
    refreshControl(): void;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @param options - (default: `{}`)
     */
    updateSource(options?: AmbientSound.UpdateSourceOptions): void;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHUD(user: User.Implementation, event?: any): boolean;

    protected override _canConfigure(user: User.Implementation, event?: any): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragEnd(): void;
  }
}
