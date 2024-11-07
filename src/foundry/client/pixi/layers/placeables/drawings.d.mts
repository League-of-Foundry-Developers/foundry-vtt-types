export {};

declare global {
  /**
   * The DrawingsLayer subclass of PlaceablesLayer.
   */
  class DrawingsLayer extends PlaceablesLayer<"Drawing"> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["drawings"];

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: DrawingsLayer.LayerOptions;

    /**
     * @defaultValue
     * ```
     * mergeObject(super.layerOptions, {
     *   name: "drawings"
     *   canDragCreate: true,
     *   controllableObjects: true,
     *   rotatableObjects: true,
     *   zIndex: 20
     * })
     * ```
     */
    static override get layerOptions(): DrawingsLayer.LayerOptions;

    static override documentName: "Drawing";

    /**
     * The named game setting which persists default drawing configuration for the User
     */
    static DEFAULT_CONFIG_SETTING: "defaultDrawingConfig";

    /**
     * Use an adaptive precision depending on the size of the grid
     */
    get gridPrecision(): 0 | 8 | 16;

    override get hud(): Exclude<Canvas["hud"], undefined>["drawing"];

    override get hookName(): (typeof DrawingsLayer)["name"];

    /**
     * Render a configuration sheet to configure the default Drawing settings
     */
    configureDefault(): void;

    override _deactivate(): this;

    /**
     * Get initial data for a new drawing.
     * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
     * @param origin - The initial coordinate
     * @returns The new drawing data
     * @remarks This is used from DrawingConfig and hence public on purpose.
     */
    _getNewDrawingData(origin: Canvas.Point): foundry.documents.BaseDrawing.ConstructorData;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void | Promise<void>;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): ReturnType<Drawing["draw"]>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Handling of mouse-up events which conclude a new object creation after dragging
     */
    protected _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<void>;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;
  }

  namespace DrawingsLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Drawing"> {
      name: "drawings";
      canDragCreate: true;
      controllableObjects: true;
      rotatableObjects: true;
      elevationSorting: true;
      zIndex: 20;
    }
  }
}
