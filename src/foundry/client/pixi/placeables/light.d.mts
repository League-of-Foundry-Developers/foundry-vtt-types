import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type {
  FixedInstanceType,
  HandleEmptyObject,
  IntentionalPartial,
  NullishProps,
  RequiredProps,
} from "fvtt-types/utils";
import PointDarknessSource = foundry.canvas.sources.PointDarknessSource;
import PointLightSource = foundry.canvas.sources.PointLightSource;

declare global {
  /**
   * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
   * @see {@linkcode AmbientLightDocument}
   * @see {@linkcode LightingLayer}
   */
  class AmbientLight extends PlaceableObject<AmbientLightDocument.Implementation> {
    /**
     * The area that is affected by this light.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     */
    field: PIXI.Graphics | undefined;

    /**
     * A reference to the PointSource object which defines this light or darkness area of effect.
     * This is undefined if the AmbientLight does not provide an active source of light.
     * @remarks This is not initialized to a value, but {@link AmbientLight._onCreate | `AmbientLight#_onCreate`}
     * calls {@link AmbientLight.initializeLightSource | `AmbientLight#initializeLightSource`}, so it could be set immediately.
     *
     * Set `undefined` in {@link AmbientLight._destroy | `AmbientLight#_destroy`}.
     */
    lightSource: PointLightSource.ConfiguredInstance | PointDarknessSource.ConfiguredInstance | undefined;

    static override embeddedName: "AmbientLight";

    static override RENDER_FLAGS: AmbientLight.RENDER_FLAGS;

    // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
    // `RENDER_FLAGS` and so it has to be adjusted here.
    renderFlags: RenderFlags<AmbientLight.RENDER_FLAGS>;

    override get bounds(): PIXI.Rectangle;

    override get sourceId(): string;

    /**
     * A convenience accessor to the LightData configuration object
     */
    get config(): foundry.data.LightData;

    /**
     * Test whether a specific AmbientLight source provides global illumination
     */
    get global(): boolean;

    /**
     * The maximum radius in pixels of the light field
     */
    get radius(): number;

    /**
     * Get the pixel radius of dim light emitted by this light source
     */
    get dimRadius(): number;

    /**
     * Get the pixel radius of bright light emitted by this light source
     */
    get brightRadius(): number;

    /**
     * Is this Ambient Light currently visible? By default, true only if the source actively emits light.
     */
    get isVisible(): boolean;

    /**
     * Check if the point source is a LightSource instance
     * @remarks Checks via `instanceof` against the configured class, not simply PointLightSource
     */
    get isLightSource(): boolean;

    /**
     * Check if the point source is a DarknessSource instance
     * @remarks Checks via `instanceof` against the configured class, not simply PointDarknessSource
     */
    get isDarknessSource(): boolean;

    /**
     * Is the source of this Ambient Light disabled?
     */
    protected _isLightSourceDisabled(): boolean;

    /**
     * Does this Ambient Light actively emit darkness light given its properties and the current darkness level of the Scene?
     */
    get emitsDarkness(): boolean;

    /**
     * Does this Ambient Light actively emit positive light given its properties and the current darkness level of the Scene?
     */
    get emitsLight(): boolean;

    protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

    protected override _draw(options: HandleEmptyObject<AmbientLight.DrawOptions>): Promise<void>;

    // fake override; super has to account for misbehaving siblings returning void
    override clear(): this;

    protected override _applyRenderFlags(flags: AmbientLight.RenderFlags): void;

    /**
     * Refresh the shape of the light field-of-effect. This is refreshed when the AmbientLight fov polygon changes.
     */
    protected _refreshField(): void;

    /**
     * Refresh the position of the AmbientLight. Called with the coordinates change.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the elevation of the control icon.
     */
    protected _refreshElevation(): void;

    /**
     * Refresh the state of the light. Called when the disabled state or darkness conditions change.
     */
    protected _refreshState(): void;

    /**
     * Refresh the display of the ControlIcon for this AmbientLight source
     */
    refreshControl(): void;

    /**
     * Update the LightSource associated with this AmbientLight object.
     * @param options - Options which modify how the source is updated
     */
    initializeLightSource(options?: AmbientLight.InitializeLightSourceOptions): void;

    /**
     * Get the light source data.
     */
    protected _getLightSourceData(): AmbientLight.LightSourceData;

    // _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    protected override _canHUD(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canDragLeftStart(user: User.Implementation, event: DragEvent): boolean;

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
     * @remarks "`AmbientLight#updateSource` has been deprecated in favor of {@link AmbientLight.initializeLightSource | `AmbientLight#initializeLightSource`}"
     */
    // options: not null (destructured)
    updateSource(options?: AmbientLight.InitializeLightSourceOptions): void;

    /**
     * @deprecated since v12, until v14
     * @remarks "`AmbientLight#source` has been deprecated in favor of {@link AmbientLight.lightSource | `AmbientLight#lightSource`}"
     */
    get source(): this["lightSource"];
  }

  namespace AmbientLight {
    /**
     * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode AmbientLightDocument.Implementation}
     * which refers to the implementation for the AmbientLight document.
     */
    type Implementation = FixedInstanceType<ImplementationClass>;

    /**
     * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode AmbientLightDocument.ImplementationClass}
     * which refers to the implementation for the AmbientLight document.
     */
    // eslint-disable-next-line no-restricted-syntax
    type ImplementationClass = ConfiguredObjectClassOrDefault<typeof AmbientLight>;

    /**
     * @deprecated Replaced with {@linkcode ImplementationClass}
     */
    type ObjectClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode Implementation}
     */
    type Object = Implementation;

    /**
     * @deprecated Replaced with {@linkcode AmbientLight.ImplementationClass}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode AmbientLight.Implementation}
     */
    type ConfiguredInstance = Implementation;

    interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
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

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    /**
     * @internal
     */
    type _InitializeLightSourceOptions = NullishProps<{
      /**
       * Indicate that this SoundSource has been deleted.
       * @defaultValue `false`
       */
      deleted: boolean;
    }>;

    interface InitializeLightSourceOptions extends _InitializeLightSourceOptions {}

    /**
     * @remarks {@link AmbientLight._getLightSourceData | `AmbientLight#_getLightSourceData`} calls `mergeObject` on the return of
     * {@link foundry.data.LightData.toObject | `LightData#toObject(false)`} and the enumerated properties below and
     * returns the result. This gets passed to {@link foundry.canvas.sources.PointLightSource.initialize | `AmbientLight#lightSource#initialize()`},
     * so this is a `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
     */
    type LightSourceData = foundry.data.fields.SchemaField.InitializedData<foundry.data.LightData.Schema> &
      RequiredProps<
        IntentionalPartial<PointLightSource.SourceData>,
        "x" | "y" | "elevation" | "rotation" | "walls" | "vision" | "dim" | "bright" | "seed" | "disabled" | "preview"
      >;
  }
}
