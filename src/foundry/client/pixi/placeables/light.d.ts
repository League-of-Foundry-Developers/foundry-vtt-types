import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
   */
  class AmbientLight extends PlaceableObject<InstanceType<ConfiguredDocumentClassForName<"AmbientLight">>> {
    constructor(document: InstanceType<ConfiguredDocumentClassForName<"AmbientLight">>);

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

    /**
     * The flags declared here are required for all PlaceableObject subclasses to also support.
     */
    static override RENDER_FLAGS: {
      /** @defaultValue `{propagate: ["refresh"]}` */
      redraw: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;

      /** @defaultValue `{propagate: ["refreshField"], alias: true}` */
      refresh: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;

      /** @defaultValue `{propagate: ["refreshPosition", "refreshState"]}` */
      refreshField: RenderFlag<AmbientLight.AmbientLightRenderFlags>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<AmbientLight.AmbientLightRenderFlags>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;
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

    /**
     * @param options - unused
     */
    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * @param options - unused
     */
    protected override _draw(options: Record<string, unknown>): Promise<void>;

    protected override _applyRenderFlags(flags: AmbientLight.AmbientLightRenderFlags): void;

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

    protected override _onCreate(
      data: foundry.data.AmbientLightData["_source"],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.AmbientLightData["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _canHUD(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): Promise<this>;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;
  }

  namespace AmbientLight {
    interface AmbientLightRenderFlags extends PlaceableObject.PlaceableObjectRenderFlags {
      refreshField: boolean;

      refreshPosition: boolean;
    }
  }
}
