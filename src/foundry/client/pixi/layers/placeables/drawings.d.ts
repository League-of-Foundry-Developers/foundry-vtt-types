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
     * TODO: Replace NewDrawingData with DrawingData that's drawn from BaseDrawing (see: common/documents/drawing.mjs)
     */
    _getNewDrawingData(origin: Point): NewDrawingData;

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

  type NewDrawingData = ClientSettings.Values["core.defaultDrawingConfig"] & {
    _id: null;
    author: string;
    fillColor: string;
    strokeColor: string;
    fontFamily: typeof CONFIG.defaultFontFamily;
    x: number;
    y: number | undefined;
    /** Following properties come from DrawingDocument.CleanData */
    shape: {
      height: null;
      points: PointArray[];
      radius: null;
      width: null;
    };
    bezierFactor: number;
    fillAlpha: number;
  } & (
      | {
          /** case "rect" && case "ellipse" */
          shape: {
            type: (typeof Drawing)["SHAPE_TYPES"]["RECTANGLE" | "ELLIPSE"];
            width: number;
            height: number;
          };
        }
      | {
          /** case "polygon" && case "freehand" */
          shape: {
            type: (typeof Drawing)["SHAPE_TYPES"]["POLYGON"];
            points: PointArray[];
          };
          bezierFactor: number;
        }
      | {
          /** case "text" */
          shape: {
            type: (typeof Drawing)["SHAPE_TYPES"]["RECTANGLE" | "ELLIPSE"];
            width: number;
            height: number;
          };
          /** @defaultValue `"#FFFFFF"` */
          fillColor: string;

          /** @defaultValue `0.10` */
          fillAlpha: number;

          /** @defaultValue `"#FFFFFF"` */
          strokeColor: string;

          /** @defaultValue `"New Text"` */
          text: string;
        }
    );
}
