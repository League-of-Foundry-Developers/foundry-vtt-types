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

    override get bounds(): NormalizedRectangle;

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
     * Return whether the light source is currently visible in the scene
     */
    get isVisible(): boolean;

    override draw(): Promise<this>;

    override destroy(options?: Parameters<PlaceableObject["destroy"]>[0]): void;

    /**
     * Draw the ControlIcon for the AmbientLight
     * @internal
     */
    protected _drawControlIcon(): ControlIcon;

    override refresh(): this;

    /**
     * Refresh the display of the ControlIcon for this AmbientLight source
     */
    refreshControl(): void;

    /**
     * The named identified for the source object associated with this light
     */
    get sourceId(): string;

    /**
     * Update the source object associated with this light
     * @param options - (default: `{}}`)
     */
    updateSource(options?: AmbientLight.UpdateSourceOptions | undefined): void;

    protected override _onCreate(
      data: foundry.data.AmbientLightData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.AmbientLightData["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _canHUD(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _onClickRight(event: PIXI.InteractionEvent): Promise<this>;

    protected override _onDragLeftStart(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftCancel(event: MouseEvent): void;
  }

  namespace AmbientLight {
    interface UpdateSourceOptions {
      /**
       * Defer refreshing the LightingLayer to manually call that refresh later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this light source has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;
    }
  }
}
