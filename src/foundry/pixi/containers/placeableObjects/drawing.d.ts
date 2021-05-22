/**
 * The Drawing object is an implementation of the :class:`PlaceableObject` container.
 * Each Drawing is a placeable object in the :class:`DrawingsLayer`.
 *
 * @example
 * ```typescript
 * Drawing.create<Drawing>({
 *   type: CONST.DRAWING_TYPES.RECTANGLE,
 *   author: game.user._id,
 *   x: 1000,
 *   y: 1000,
 *   width: 800,
 *   height: 600,
 *   fillType: CONST.DRAWING_FILL_TYPES.SOLID,
 *   fillColor: "#0000FF",
 *   fillAlpha: 0.5,
 *   strokeWidth: 4,
 *   strokeColor: "#FF0000",
 *   strokeAlpha: 0.75,
 *   texture: "ui/parchment.jpg",
 *   textureAlpha: 0.5,
 *   text: "HELLO DRAWINGS!",
 *   fontSize: 48,
 *   textColor: "#00FF00",
 *   points: []
 * });
 * ```
 */
declare class Drawing extends PlaceableObject<Drawing.Data> {
  /**
   * @remarks Not used for `Drawing`
   */
  controlIcon: null;

  /**
   * The inner drawing container
   */
  drawing: PIXI.Container | null;

  /**
   * The primary drawing shape
   */
  shape: PIXI.Graphics | null;

  /**
   * Text content, if included
   */
  text: PIXI.Text | null;

  /**
   * The Graphics outer frame and handles
   */
  frame: PIXI.Container | null;

  /**
   * Internal timestamp for the previous freehand draw time, to limit sampling
   */
  protected _drawTime: number;

  protected _sampleTime: number;

  /**
   * Internal flag for the permanent points of the polygon
   */
  protected _fixedPoints: Array<[number, number]>;

  /** @override */
  static get embeddedName(): 'Drawing';

  /**
   * @remarks
   * Not implemented for Drawing
   */
  get bounds(): never;

  /**
   * A reference to the User who created the Drawing object
   */
  get author(): User;

  /**
   * A flag for whether the current user has full control over the Drawing object
   */
  get owner(): boolean;

  /**
   * A Boolean flag for whether or not the Drawing utilizes a tiled texture background
   */
  get isTiled(): boolean;

  /**
   * A Boolean flag for whether or not the Drawing is a Polygon type (either linear or freehand)
   */
  get isPolygon(): boolean;

  /** @override */
  draw(): Promise<this>;

  /**
   * Create the components of the drawing element, the drawing container, the drawn shape, and the overlay text
   */
  protected _createDrawing(): void;

  /**
   * Create elements for the foreground text
   */
  protected _createText(): PreciseText;

  /**
   * Create elements for the Drawing border and handles
   */
  protected _createFrame(): void;

  /** @override */
  refresh(): void;

  /**
   * Draw rectangular shapes
   */
  protected _drawRectangle(): void;

  /**
   * Draw ellipsoid shapes
   */
  protected _drawEllipse(): void;

  /**
   * Draw polygonal shapes
   */
  protected _drawPolygon(): void;

  /**
   * Draw freehand shapes with bezier spline smoothing
   */
  protected _drawFreehand(): void;

  /**
   * Attribution: The equations for how to calculate the bezier control points are derived from Rob Spencer's article:
   * http://scaledinnovation.com/analytics/splines/aboutSplines.html
   * @param factor   - The smoothing factor
   * @param previous - The prior point
   * @param point    - The current point
   * @param next     - The next point
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
   */
  protected _refreshFrame({ x, y, width, height }: Rectangle): void;

  /**
   * Add a new polygon point to the drawing, ensuring it differs from the last one
   */
  protected _addPoint(position: Point, temporary?: boolean): void;

  /**
   * Remove the last fixed point from the polygon
   */
  protected _removePoint(): void;

  /** @override */
  protected _onControl(options: { isNew?: boolean }): void;

  /** @override */
  protected _onRelease(options: any): void;

  /** @override */
  protected _onDelete(): void;

  /**
   * Handle text entry in an active text tool
   */
  protected _onDrawingTextKeydown(event: KeyboardEvent): void;

  /** @override */
  protected _onUpdate(data: Drawing.Data): void;

  /** @override */
  protected _canControl(user: User, event?: any): boolean;

  /** @override */
  protected _canHUD(user: User, event?: any): boolean;

  /** @override */
  protected _canConfigure(user: User, event?: any): boolean;

  /** @override */
  activateListeners(): void;

  /**
   * Handle mouse movement which modifies the dimensions of the drawn shape
   */
  protected _onMouseDraw(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<this | Drawing>;

  /** @override */
  protected _onDragLeftCancel(event: PIXI.InteractionEvent): void;

  /**
   * Handle mouse-over event on a control handle
   * @param event - The mouseover event
   */
  protected _onHandleHoverIn(event: PIXI.InteractionEvent): void;

  /**
   * Handle mouse-out event on a control handle
   * @param event - The mouseout event
   */
  protected _onHandleHoverOut(event: PIXI.InteractionEvent): void;

  /**
   * When we start a drag event - create a preview copy of the Tile for re-positioning
   * @param event - The mousedown event
   */
  protected _onHandleMouseDown(event: PIXI.InteractionEvent): void;

  /**
   * Handle the beginning of a drag event on a resize handle
   */
  protected _onHandleDragStart(event: PIXI.InteractionEvent): void;

  /**
   * Handle mousemove while dragging a tile scale handler
   * @param event - The mousemove event
   */
  protected _onHandleDragMove(event: PIXI.InteractionEvent): void;

  /**
   * Handle mouseup after dragging a tile scale handler
   * @param event - The mouseup event
   */
  protected _onHandleDragDrop(event: PIXI.InteractionEvent): Promise<this>;

  /**
   * Handle cancellation of a drag event for one of the resizing handles
   */
  protected _onHandleDragCancel(event: PIXI.InteractionEvent): void;

  /**
   * Apply a vectorized rescaling transformation for the drawing data
   * @param original - The original drawing data
   * @param dx       - The pixel distance dragged in the horizontal direction
   * @param dy       - The pixel distance dragged in the vertical direction
   */
  protected _rescaleDimensions(original: Drawing.Data, dx: number, dy: number): Drawing.Data;

  /**
   * Adjust the location, dimensions, and points of the Drawing before committing the change
   * @param data - The Drawing data pending update
   * @returns The adjusted data
   */
  protected static normalizeShape(data: Drawing.Data): Drawing.Data;
}

declare namespace Drawing {
  interface Data extends PlaceableObject.Data {
    author: string;
    bezierFactor: number;
    fillAlpha: number;
    fillColor: string;
    fillType: foundry.CONST.DrawingFillType;
    fontFamily: string;
    fontSize: number;
    height: number;
    hidden: boolean;
    locked: boolean;
    points: Array<[number, number]>;
    rotation: number;
    strokeAlpha: number;
    strokeColor: string;
    strokeWidth: number;
    textAlpha: number;
    textColor: string;
    type: 'r' | 'e' | 't' | 'p' | 'f';
    width: number;
    x: number;
    y: number;
    z: number;
  }
}
