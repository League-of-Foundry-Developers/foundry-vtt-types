import { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * The Drawing object is an implementation of the PlaceableObject container.
   * Each Drawing is a placeable object in the DrawingsLayer.
   */
  class Drawing extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>> {
    constructor(document: InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>);
    /**
     * @remarks Not used for `Drawing`
     */
    controlIcon: null;

    /**
     * The inner drawing container
     * @defaultValue `null`
     */
    drawing: PIXI.Container | null;

    /**
     * The primary drawing shape
     * @defaultValue `null`
     */
    shape: PIXI.Graphics | null;

    /**
     * Text content, if included
     * @defaultValue `null`
     */
    text: PIXI.Text | null;

    /**
     * The Graphics outer frame and handles
     * @defaultValue `null`
     */
    frame: PIXI.Container | null;

    /**
     * Internal timestamp for the previous freehand draw time, to limit sampling
     * @defaultValue `0`
     * @internal
     */
    protected _drawTime: number;

    /**
     * @defaultValue `0`
     * @internal
     */
    protected _sampleTime: number;

    /**
     * Internal flag for the permanent points of the polygon
     * @defaultValue `foundry.utils.deepClone(this.data.points || [])`
     * @internal
     */
    protected _fixedPoints: Array<[x: number, y: number]>;

    static override embeddedName: "Drawing";

    /**
     * The rate at which points are sampled (in milliseconds) during a freehand drawing workflow
     * @defaultValue `75`
     */
    static FREEHAND_SAMPLE_RATE: number;

    override get bounds(): Rectangle;

    /**
     * A Boolean flag for whether or not the Drawing utilizes a tiled texture background
     */
    get isTiled(): boolean;

    /**
     * A Boolean flag for whether or not the Drawing is a Polygon type (either linear or freehand)
     */
    get isPolygon(): boolean;

    override draw(): Promise<this>;

    /**
     * Clean the drawing data to constrain its allowed position
     * @internal
     */
    protected _cleanData(): void;

    /**
     * Create the components of the drawing element, the drawing container, the drawn shape, and the overlay text
     */
    protected _createDrawing(): void;

    /**
     * Create elements for the foreground text
     * @internal
     */
    protected _createText(): PreciseText;

    /**
     * Create elements for the Drawing border and handles
     * @internal
     */
    protected _createFrame(): void;

    override refresh(): void;

    /**
     * Draw rectangular shapes
     * @internal
     */
    protected _drawRectangle(): void;

    /**
     * Draw ellipsoid shapes
     * @internal
     */
    protected _drawEllipse(): void;

    /**
     * Draw polygonal shapes
     * @internal
     */
    protected _drawPolygon(): void;

    /**
     * Draw freehand shapes with bezier spline smoothing
     * @internal
     */
    protected _drawFreehand(): void;

    /**
     * Attribution: The equations for how to calculate the bezier control points are derived from Rob Spencer's article:
     * http://scaledinnovation.com/analytics/splines/aboutSplines.html
     * @param factor   - The smoothing factor
     * @param previous - The prior point
     * @param point    - The current point
     * @param next     - The next point
     * @internal
     */
    protected _getBezierControlPoints(
      factor: number,
      previous: [number, number],
      point: [number, number],
      next: [number, number]
    ): {
      cp1: {
        x: number;
        y: number;
      };
      next_cp0: {
        x: number;
        y: number;
      };
    };

    /**
     * Refresh the boundary frame which outlines the Drawing shape
     * @internal
     */
    protected _refreshFrame({ x, y, width, height }: Rectangle): void;

    /**
     * Add a new polygon point to the drawing, ensuring it differs from the last one
     * @param temporary - (default: `true`)
     * @internal
     */
    protected _addPoint(position: Point, temporary?: boolean): void;

    /**
     * Remove the last fixed point from the polygon
     * @internal
     */
    protected _removePoint(): void;

    protected override _onControl(options: PlaceableObject.ControlOptions & { isNew?: boolean }): void;

    protected override _onRelease(options: PlaceableObject.ReleaseOptions): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Handle text entry in an active text tool
     * @internal
     */
    protected _onDrawingTextKeydown(event: KeyboardEvent): void;

    protected override _onUpdate(data: DeepPartial<foundry.data.DrawingData["_source"]>): void;

    /**
     * @param event - unused
     */
    protected override _canControl(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    /**
     * @param user  - unused
     * @param event - unused
     */
    protected override _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    override activateListeners(): void;

    /**
     * Handle mouse movement which modifies the dimensions of the drawn shape
     * @internal
     */
    protected _onMouseDraw(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftStart(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<unknown>;

    protected override _onDragLeftCancel(event: MouseEvent): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     * @internal
     */
    protected _onHandleHoverIn(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     * @internal
     */
    protected _onHandleHoverOut(event: PIXI.InteractionEvent): void;

    /**
     * When we start a drag event - create a preview copy of the Tile for re-positioning
     * @param event - The mousedown event
     * @internal
     */
    protected _onHandleMouseDown(event: PIXI.InteractionEvent): void;

    /**
     * Handle the beginning of a drag event on a resize handle
     * @internal
     */
    protected _onHandleDragStart(event: PIXI.InteractionEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     * @internal
     */
    protected _onHandleDragMove(event: PIXI.InteractionEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     * @internal
     */
    protected _onHandleDragDrop(
      event: PIXI.InteractionEvent
    ): ReturnType<InstanceType<ConfiguredDocumentClass<typeof DrawingDocument>>["update"]>;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     * @internal
     */
    protected _onHandleDragCancel(event: PIXI.InteractionEvent): void;

    /**
     * Apply a vectorized rescaling transformation for the drawing data
     * @param original - The original drawing data
     * @param dx       - The pixel distance dragged in the horizontal direction
     * @param dy       - The pixel distance dragged in the vertical direction
     * @internal
     */
    protected _rescaleDimensions(
      original: Pick<foundry.data.DrawingData["_source"], "x" | "y" | "points" | "width" | "height">,
      dx: number,
      dy: number
    ): Pick<foundry.data.DrawingData["_source"], "x" | "y" | "width" | "height" | "points">;

    /**
     * Adjust the location, dimensions, and points of the Drawing before committing the change
     * @param data - The Drawing data pending update
     * @returns The adjusted data
     * @remarks This is intentionally public because it is called by the DrawingsLayer
     * @internal
     */
    static normalizeShape(
      data: Pick<foundry.data.DrawingData["_source"], "x" | "y" | "width" | "height" | "points">
    ): Pick<foundry.data.DrawingData["_source"], "x" | "y" | "width" | "height" | "points">;
  }
}
