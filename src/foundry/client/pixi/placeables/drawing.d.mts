import type { ValueOf, FixedInstanceType } from "fvtt-types/utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  namespace Drawing {
    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Drawing>;
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshShape: boolean;

      refreshFrame: boolean;

      refreshText: boolean;

      refreshMesh: boolean;
    }

    interface TextEditingOptions {
      forceTextEditing?: boolean;

      isNew?: boolean;
    }

    interface AdjustableShape {
      shape: {
        width: number;
        height: number;
        points: Canvas.Point[];
      };
      x: number;
      y: number;
    }
  }

  /**
   * The Drawing object is an implementation of the PlaceableObject container.
   * Each Drawing is a placeable object in the DrawingsLayer.
   */
  class Drawing extends PlaceableObject<DrawingDocument.ConfiguredInstance> {
    constructor(document: DrawingDocument.ConfiguredInstance);

    /**
     * Each Drawing object belongs to the DrawingsLayer
     * @remarks it's possible this shouldn't be here and is some data model thing
     */
    get layer(): DrawingsLayer;

    /**
     * Each Drawing object provides an interface for a DrawingDocument
     */
    document: DrawingDocument;

    /**
     * The border frame and resizing handles for the drawing.
     */
    frame: PIXI.Container;

    /**
     * A text label that may be displayed as part of the interface layer for the Drawing.
     * @defaultValue `null`
     */
    text: PreciseText | null;

    /**
     * The primary drawing shape
     * @defaultValue `null`
     */
    shape: PrimaryGraphics | PIXI.Graphics;

    static override embeddedName: "Drawing";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshShape"], alias: true }` */
      refresh: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshFrame"] }` */
      refreshState: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshFrame", "refreshText", "refreshMesh"] }` */
      refreshShape: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<Drawing.RenderFlags>;

      /** @defaultValue `{}` */
      refreshMesh: RenderFlag<Drawing.RenderFlags>;
    };

    /**
     * The rate at which points are sampled (in milliseconds) during a freehand drawing workflow
     * @defaultValue `75`
     */
    static FREEHAND_SAMPLE_RATE: number;

    /**
     * A convenience reference to the possible shape types.
     */
    static readonly SHAPE_TYPES: (typeof foundry.data.ShapeData)["TYPES"];

    override get bounds(): PIXI.Rectangle;

    override get center(): PIXI.Point;

    /**
     * A Boolean flag for whether the Drawing utilizes a tiled texture background
     */
    get isTiled(): boolean;

    /**
     * A Boolean flag for whether the Drawing is a Polygon type (either linear or freehand)?
     */
    get isPolygon(): boolean;

    /**
     * Does the Drawing have text that is displayed?
     */
    get hasText(): boolean;

    /**
     * The shape type that this Drawing represents. A value in Drawing.SHAPE_TYPES.
     */
    get type(): ValueOf<(typeof foundry.data.ShapeData)["TYPES"]>;

    override clear(): this;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    /**
     * Prepare the text style used to instantiate a PIXI.Text or PreciseText instance for this Drawing document.
     */
    protected _getTextStyle(): PIXI.TextStyle;

    protected override _applyRenderFlags(flags: Drawing.RenderFlags): void;

    /**
     * Draw ellipsoid shapes
     * @internal
     */
    protected _drawEllipse(): void;

    /**
     * Add a new polygon point to the drawing, ensuring it differs from the last one
     * @param position - The drawing point to add
     * @param options  - Options which configure how the point is added
     * @internal
     */
    protected _addPoint(
      position: Canvas.Point,
      options?: {
        /**
         * Should the point be rounded to integer coordinates?
         * @defaultValue `false`
         */
        round?: boolean;

        /**
         * Should the point be snapped to grid precision?
         * @defaultValue `false`
         */
        snap?: boolean;

        /**
         * Is this a temporary control point?
         * @defaultValue `false`
         */
        temporary?: boolean;
      },
    ): void;

    /**
     * Remove the last fixed point from the polygon
     * @internal
     */
    protected _removePoint(): void;

    protected override _onControl(options: PlaceableObject.ControlOptions & Drawing.TextEditingOptions): void;

    protected override _onRelease(options: PlaceableObject.ReleaseOptions): void;

    /**
     * @privateRemarks _onDelete and _onUpdate are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    override activateListeners(): void;

    /**
     * @param event - unused
     */
    protected override _canControl(user: User.ConfiguredInstance, event?: any): boolean;

    /**
     * @param user  - unused
     * @param event - unused
     */
    protected override _canConfigure(user: User.ConfiguredInstance, event?: any): boolean;

    /**
     * Handle mouse movement which modifies the dimensions of the drawn shape
     * @internal
     */
    protected _onMouseDraw(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<unknown>;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     * @internal
     */
    protected _onHandleHoverIn(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     * @internal
     */
    protected _onHandleHoverOut(event: PIXI.FederatedEvent): void;

    /**
     * When clicking the resize handle, initialize the drag property.
     * @param event - The mousedown event
     * @internal
     */
    protected _onHandleMouseDown(event: PIXI.FederatedEvent): void;

    /**
     * Starting the resize handle drag event, initialize the original data.
     * @internal
     */
    protected _onHandleDragStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     * @internal
     */
    protected _onHandleDragMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     * @internal
     */
    protected _onHandleDragDrop(event: PIXI.FederatedEvent): ReturnType<DrawingDocument.ConfiguredInstance["update"]>;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     * @internal
     */
    protected _onHandleDragCancel(event: PIXI.FederatedEvent): void;

    /**
     * Get a vectorized rescaling transformation for drawing data and dimensions passed in parameter
     * @param original - The original drawing data
     * @param dx       - The pixel distance dragged in the horizontal direction
     * @param dy       - The pixel distance dragged in the vertical direction
     * @returns The adjusted shape data
     * @internal
     */
    static rescaleDimensions(original: Drawing.AdjustableShape, dx: number, dy: number): Drawing.AdjustableShape;

    /**
     * Adjust the location, dimensions, and points of the Drawing before committing the change
     * @param data - The DrawingData pending update
     * @returns The adjusted data
     * @remarks This is intentionally public because it is called by the DrawingsLayer
     * @internal
     */
    static normalizeShape(data: Drawing.AdjustableShape): Drawing.AdjustableShape;

    /**
     * @remarks Not used
     */
    controlIcon: null;
  }
}
