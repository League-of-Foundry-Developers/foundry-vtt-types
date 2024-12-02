import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { NullishProps } from "../../../../types/utils.d.mts";
import type PointDarknessSource from "../../../client-esm/canvas/sources/point-darkness-source.d.mts";
import type PointLightSource from "../../../client-esm/canvas/sources/point-light-source.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

// TODO: Remove when the whole class is updated
type LightSource = unknown;

declare global {
  /**
   * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
   * @see {@link AmbientLightDocument}
   * @see {@link LightingLayer}
   */
  class AmbientLight<
    ControlOptions extends AmbientLight.ControlOptions = AmbientLight.ControlOptions,
    DestroyOptions extends AmbientLight.DestroyOptions | boolean = AmbientLight.DestroyOptions | boolean,
    DrawOptions extends AmbientLight.DrawOptions = AmbientLight.DrawOptions,
    ReleaseOptions extends AmbientLight.ReleaseOptions = AmbientLight.ReleaseOptions,
  > extends PlaceableObject<
    AmbientLightDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    constructor(document: AmbientLightDocument.ConfiguredInstance);

    /**
     * The area that is affected by this light.
     */
    field: PIXI.Graphics | undefined;

    /**
     * A reference to the PointSource object which defines this light or darkness area of effect.
     * This is undefined if the AmbientLight does not provide an active source of light.
     */
    lightSource: PointLightSource | PointDarknessSource | undefined;

    static override embeddedName: "AmbientLight";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<AmbientLight.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshField", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<Partial<AmbientLight.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition"] }` */
      refreshField: RenderFlag<Partial<AmbientLight.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<Partial<AmbientLight.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<Partial<AmbientLight.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<Partial<AmbientLight.RenderFlags>>;
    };

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
     * @remarks Backwards-compatible wrapper for this.emitsLight
     */
    get isVisible(): boolean;

    /**
     * Check if the point source is a LightSource instance
     */
    get isLightSource(): boolean;

    /**
     * Check if the point source is a DarknessSource instance
     */
    get isDarknessSource(): boolean;

    /**
     * Is the source of this Ambient Light disabled?
     */
    protected _isLightSourceDisabled(): boolean;

    /**
     * Does this Ambient Light actively emit darkness light given
     * its properties and the current darkness level of the Scene?
     */
    get emitsDarkness(): boolean;

    /**
     * Does this Ambient Light actively emit positive light given
     * its properties and the current darkness level of the Scene?
     */
    get emitsLight(): boolean;

    protected override _destroy(options?: DestroyOptions): void;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    protected override _applyRenderFlags(flags: NullishProps<AmbientLight.RenderFlags>): void;

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
     */
    initializeLightSource({
      deleted,
    }?: NullishProps<{
      /**
       * Indicate that this light source has been deleted
       * @defaultValue `false`
       */
      deleted: boolean;
    }>): void;

    /**
     * Get the light source data.
     */
    protected _getLightSourceData(): foundry.data.LightData;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected _canDragLeftStart(
      user: User.ConfiguredInstance,
      event: DragEvent,
    ): ReturnType<PlaceableObject<AmbientLightDocument.ConfiguredInstance>["_canDragLeftStart"]>;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Update the source object associated with this light
     * @param options - Options which modify how the source is updated
     * @deprecated since v12, until v14
     * @remarks "AmbientLight#updateSource has been deprecated in favor of AmbientLight#initializeLightSource"
     */
    updateSource(
      options?: NullishProps<{
        /**
         * Indicate that this light source has been deleted
         * @defaultValue `false`
         */
        deleted?: boolean;
      }>,
    ): void;

    /**
     * @deprecated since v12, until v14
     * @remarks "AmbientLight#source has been deprecated in favor of AmbientLight#lightSource"
     */
    get source(): this["lightSource"];
  }

  namespace AmbientLight {
    type AnyConstructor = typeof AnyAmbientLight;

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof AmbientLight>;
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
  }
}

declare abstract class AnyAmbientLight extends AmbientLight {
  constructor(arg0: never, ...args: never[]);
}
