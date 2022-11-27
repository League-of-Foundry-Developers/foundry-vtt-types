/**
 * The DrawingsLayer subclass of PlaceablesLayer.
 * This layer implements a container for drawings which are rendered immediately above the BackgroundLayer.
 */
declare class DrawingsLayer extends PlaceablesLayer<"Drawing", DrawingsLayer.LayerOptions> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["drawings"];

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

  /**
   * Render a configuration sheet to configure the default Drawing settings
   */
  configureDefault(): void;

  /**
   * Override the deactivation behavior of this layer.
   * Placeables on this layer remain visible even when the layer is inactive.
   */
  deactivate(): this;

  /**
   * Get initial data for a new drawing.
   * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
   * @param origin - The initial coordinate
   * @returns The new drawing data
   * @remarks This is used from DrawingConfig and hence public on purpose.
   */
  _getNewDrawingData(origin: Point | {}): NewDrawingData;

  protected override _onClickLeft(event: PIXI.InteractionEvent): void;

  protected override _onClickLeft2(event: PIXI.InteractionEvent): void | Promise<void>;

  protected override _onDragLeftStart(event: PIXI.InteractionEvent): ReturnType<Drawing["draw"]>;

  protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * Handling of mouse-up events which conclude a new object creation after dragging
   */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<void>;

  protected override _onDragLeftCancel(event: PointerEvent): void;

  protected override _onClickRight(event: PIXI.InteractionEvent): void;
}

declare namespace DrawingsLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<"Drawing"> {
    name: "drawings";
    canDragCreate: true;
    controllableObjects: true;
    rotatableObjects: true;
    zIndex: 20;
  }
}

type NewDrawingData = ClientSettings.Values["core.defaultDrawingConfig"] &
  (
    | {
        type: typeof foundry.CONST.DRAWING_TYPES.RECTANGLE | typeof foundry.CONST.DRAWING_TYPES.ELLIPSE;
        points: [];
      }
    | {
        type: typeof foundry.CONST.DRAWING_TYPES.POLYGON;
        points: PointArray[];
      }
    | {
        type: typeof foundry.CONST.DRAWING_TYPES.FREEHAND;
        points: PointArray[];
        bezierFactor: number;
      }
    | {
        type: typeof foundry.CONST.DRAWING_TYPES.TEXT;
        fillColor: string;
        fillAlpha: number;
        strokeColor: string;
        text: string;
      }
  ) & {
    author: string;
    fillColor: string;
    strokeColor: string;
    fontFamily: typeof CONFIG.defaultFontFamily;
    x: number | undefined;
    y: number | undefined;
  };
