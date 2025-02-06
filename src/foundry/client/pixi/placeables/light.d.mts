import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType } from "fvtt-types/utils";

// TODO: Remove when the whole class is updated
type LightSource = unknown;

declare global {
  namespace AmbientLight {
    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof AmbientLight>;
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshField: boolean;

      refreshPosition: boolean;
    }
  }

  /**
   * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
   * @see {@link AmbientLightDocument}
   * @see {@link LightingLayer}
   */
  class AmbientLight extends PlaceableObject<AmbientLightDocument.ConfiguredInstance> {
    constructor(document: AmbientLightDocument.ConfiguredInstance);

    /**
     * A reference to the PointSource object which defines this light source area of effect
     */
    source: LightSource;

    /**
     * A reference to the ControlIcon used to configure this light
     * @defaultValue `undefined`
     */
    controlIcon: ControlIcon | undefined;

    static override embeddedName: "AmbientLight";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<AmbientLight.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshField"], alias: true }` */
      refresh: RenderFlag<AmbientLight.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshState"] }` */
      refreshField: RenderFlag<AmbientLight.RenderFlags>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<AmbientLight.RenderFlags>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<AmbientLight.RenderFlags>;
    };

    override get bounds(): PIXI.Rectangle;

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
     * Does this Ambient Light actively emit light given its properties and the current darkness level of the Scene?
     */
    get emitsLight(): boolean;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _applyRenderFlags(flags: AmbientLight.RenderFlags): void;

    /**
     * Refresh the display of the ControlIcon for this AmbientLight source
     */
    refreshControl(): void;

    /**
     * Update the source object associated with this light
     * @param options - Options which modify how the source is updated
     */
    updateSource(options?: {
      /**
       * Defer updating perception to manually update it later
       * @defaultValue `false`
       */
      defer?: boolean;

      /**
       * Indicate that this light source has been deleted
       * @defaultValue `false`
       */
      deleted?: boolean;
    }): void;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHUD(user: User.ConfiguredInstance, event?: any): boolean;

    protected override _canConfigure(user: User.ConfiguredInstance, event?: any): boolean;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onClickRight(event: PIXI.FederatedEvent): Promise<this>;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;
  }
}
