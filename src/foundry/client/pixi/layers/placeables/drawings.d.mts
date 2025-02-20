import type { HandleEmptyObject } from "../../../../../utils/index.d.mts";

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
     *   controllableObjects: true,
     *   rotatableObjects: true,
     *   zIndex: 500
     * })
     * ```
     */
    static override get layerOptions(): DrawingsLayer.LayerOptions;

    static override documentName: "Drawing";

    /**
     * The named game setting which persists default drawing configuration for the User
     */
    static DEFAULT_CONFIG_SETTING: "defaultDrawingConfig";

    graphics: Collection<Drawing>;

    override get hud(): Exclude<Canvas["hud"], undefined>["drawing"];

    override get hookName(): string;

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    /**
     * Render a configuration sheet to configure the default Drawing settings
     */
    configureDefault(): void;

    override _deactivate(): void;

    override _draw(options: HandleEmptyObject<DrawingsLayer.DrawOptions>): Promise<void>;

    /**
     * Get initial data for a new drawing.
     * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
     * @param origin - The initial coordinate
     * @returns The new drawing data
     * @remarks This is used from DrawingConfig and hence public on purpose.
     */
    _getNewDrawingData(origin: Canvas.Point): DrawingDocument.CreateData;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    /**
     * @throws A `DataModelValidationError` if document creation fails
     */
    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Handling of mouse-up events which conclude a new object creation after dragging
     * @remarks Foundry notes this as \@private
     */
    protected _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * Use an adaptive precision depending on the size of the grid
     * @deprecated since v12 until v14
     */
    get gridPrecision(): 0 | 8 | 16;
  }

  namespace DrawingsLayer {
    type AnyConstructor = typeof AnyDrawingsLayer;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<Drawing.ObjectClass> {
      name: "drawings";
      controllableObjects: true;
      rotatableObjects: true;
      zIndex: 500;
    }
  }
}

declare abstract class AnyDrawingsLayer extends DrawingsLayer {
  constructor(arg0: never, ...args: never[]);
}
