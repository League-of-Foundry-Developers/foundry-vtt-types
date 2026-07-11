import type { FixedInstanceType, HandleEmptyObject, InexactPartial, IntentionalPartial, RequiredProps } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { Sound } from "#client/audio/_module.d.mts";
import type { PointSoundSource } from "#client/canvas/sources/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      AmbientSound: AmbientSound.Implementation;
    }
  }
}

/**
 * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
 * @see {@linkcode foundry.documents.AmbientSoundDocument}
 * @see {@linkcode foundry.canvas.layers.SoundsLayer}
 */
declare class AmbientSound extends PlaceableObject<AmbientSoundDocument.Implementation> {
  // fake type override
  static override get implementation(): AmbientSound.ImplementationClass;

  /**
   * The Sound which manages playback for this AmbientSound effect
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to {@linkcode AmbientSound.sync | AmbientSound#sync}
   * or {@linkcode AmbientSound._onUpdate | AmbientSound#_onUpdate} being called (the
   * former likely via {@linkcode SoundsLayer._syncPositions | SoundsLayer#_syncPositions})
   *
   * Set `null` if this sound's document has either no `path` or no `id` (e.g if its a preview, for the latter)
   */
  sound: Sound | null | undefined;

  /**
   * A SoundSource object which manages the area of effect for this ambient sound
   * @remarks Not initialized to a value in the class body, but {@linkcode AmbientSound._onCreate | AmbientSound#_onCreate}
   * calls {@linkcode AmbientSound.initializeSoundSource}.
   *
   * Set `undefined` by {@linkcode AmbientSound._destroy | AmbientSound#_destroy}.
   */
  source: PointSoundSource.Implementation | undefined;

  /**
   * The area that is affected by this ambient sound.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  field: PIXI.Graphics | undefined;

  static override embeddedName: "AmbientSound";

  static override RENDER_FLAGS: AmbientSound.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<AmbientSound.RENDER_FLAGS>;

  /**
   * Create a Sound used to play this AmbientSound object
   */
  protected _createSound(): Sound | null;

  /**
   * Update the set of effects which are applied to the managed Sound.
   */
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
  initializeSoundSource(options?: AmbientSound.InitializeSoundSourceOptions): void;

  /**
   * Get the sound source data.
   */
  protected _getSoundSourceData(): AmbientSound.SoundSourceData;

  protected override _onCreate(
    data: AmbientSoundDocument.CreateData,
    options: AmbientSoundDocument.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected override _onUpdate(
    changed: AmbientSoundDocument.UpdateData,
    options: AmbientSoundDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected override _onDelete(options: AmbientSoundDocument.Database.OnDeleteOptions, userId: string): void;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  // Always returns `false` ("Double-right does nothing")
  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: PlaceableObject.HoverInOptions): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragEnd(): void;

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.DragLeftDropUpdate[];

  /**
   * @deprecated "`AmbientSound#updateSource` has been deprecated in favor of
   * {@linkcode AmbientSound.initializeSoundSource | AmbientSound#initializeSoundSource}" (since v12, until v14)
   * @privateRemarks The `defer` parameter exists in this signature but is not used by `#initializeSoundSource`,
   * so we can just reuse that method's options interface.
   */
  updateSource(options?: AmbientSound.InitializeSoundSourceOptions): void;

  #AmbientSound: true;
}

declare namespace AmbientSound {
  /**
   * The implementation of the `AmbientSound` placeable configured through `CONFIG.AmbientSound.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientSoundDocument.Implementation}
   * which refers to the implementation for the ambientSound document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `AmbientSound` placeable configured through `CONFIG.AmbientSound.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientSoundDocument.ImplementationClass}
   * which refers to the implementation for the ambientSound document.
   */
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"AmbientSound">;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshField", "refreshElevation"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshPosition"] }` */
    refreshField: RenderFlag<this, "refreshField">;

    /** @defaultValue `{}` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{}` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshElevation: RenderFlag<this, "refreshElevation">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  /** @internal */
  interface _ApplyEffectsOptions {
    /**
     * Is the sound currently muffled?
     * @defaultValue `false`
     */
    muffled: boolean;
  }

  interface ApplyEffectsOptions extends InexactPartial<_ApplyEffectsOptions> {}

  /** @internal */
  interface _SyncOptions {
    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `250`
     */
    fade: number;
  }

  interface SyncOptions extends InexactPartial<_SyncOptions>, InexactPartial<_ApplyEffectsOptions> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /** @internal */
  interface _InitializeSoundSourceOptions {
    /**
     * Indicate that this SoundSource has been deleted.
     * @defaultValue `false`
     */
    deleted: boolean;
  }

  interface InitializeSoundSourceOptions extends InexactPartial<_InitializeSoundSourceOptions> {}

  /**
   * @remarks The return of {@linkcode AmbientSound._getSoundSourceData | AmbientSound#_getSoundSourceData}, which gets passed to
   * {@linkcode PointSoundSource.initialize | AmbientSound#source#initialize()}, so this is a `RequiredProps<IntentionalPartial<>>`
   * rather than a `Pick<>`
   */
  type SoundSourceData = RequiredProps<
    IntentionalPartial<PointSoundSource.SourceData>,
    "x" | "y" | "elevation" | "radius" | "walls" | "disabled"
  >;
}

export default AmbientSound;
