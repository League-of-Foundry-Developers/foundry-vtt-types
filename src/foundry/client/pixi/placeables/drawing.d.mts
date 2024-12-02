import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { AnyFunction, NullishProps, ValueOf } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * The Drawing object is an implementation of the PlaceableObject container.
   * Each Drawing is a placeable object in the DrawingsLayer.
   */
  class Drawing<
    ControlOptions extends Drawing.ControlOptions = Drawing.ControlOptions,
    DestroyOptions extends Drawing.DestroyOptions | boolean = Drawing.DestroyOptions | boolean,
    DrawOptions extends Drawing.DrawOptions = Drawing.DrawOptions,
    ReleaseOptions extends Drawing.ReleaseOptions = Drawing.ReleaseOptions,
  > extends PlaceableObject<
    DrawingDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    /**
     * The texture that is used to fill this Drawing, if any.
     */
    texture: PIXI.Texture | undefined;

    /**
     * The border frame and resizing handles for the drawing.
     */
    frame: PlaceableObject.Frame | undefined;

    /**
     * A text label that may be displayed as part of the interface layer for the Drawing.
     * @defaultValue `null`
     */
    text: PreciseText | null;

    /**
     * The primary drawing shape
     * @defaultValue `null`
     */
    shape: PrimaryGraphics | PIXI.Graphics | undefined;

    static override embeddedName: "Drawing";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshText", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
      refreshTransform: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshFrame"] }` */
      refreshRotation: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshFrame", "refreshShape", "refreshText"] }` */
      refreshSize: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshFrame", "refreshText", "refreshMesh"] }` */
      refreshShape: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<Partial<Drawing.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<Partial<Drawing.RenderFlags>>;

      /**
       * @defaultValue
       * ```js
       * {
       *   propagate: ["refreshTransform", "refreshShape", "refreshElevation"],
       *   deprecated: {since: 12, until: 14, alias: true}
       * }
       * ```
       * @deprecated since v12 until v14
       */
      refreshMesh: RenderFlag<Partial<Drawing.RenderFlags>>;
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

    /**
     * A convenient reference for whether the current User is the author of the Drawing document.
     */
    get isAuthor(): boolean;

    /**
     * Is this Drawing currently visible on the Canvas?   */
    get isVisible(): boolean;

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

    protected _pendingText: string;

    protected _onkeydown: AnyFunction | null;

    protected override _destroy(options?: DestroyOptions): void;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    /**
     * Get the line style used for drawing the shape of this Drawing.
     */
    protected _getLineStyle(): PIXI.ILineStyleOptions;

    /**
     * Get the fill style used for drawing the shape of this Drawing.
     */
    protected _getFillStyle(): PIXI.IFillStyleOptions;

    /**
     * Prepare the text style used to instantiate a PIXI.Text or PreciseText instance for this Drawing document.
     */
    protected _getTextStyle(): PIXI.TextStyle;

    override clone(): this;

    protected override _applyRenderFlags(flags: NullishProps<Drawing.RenderFlags>): void;

    /**
     * Refresh the position.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the rotation.
     */
    protected _refreshRotation(): void;

    /**
     * Refresh the displayed state of the Drawing.
     * Used to update aspects of the Drawing which change based on the user interaction state.
     */
    protected _refreshState(): void;

    /**
     * Clear and then draw the shape.
     */
    protected _refreshShape(): void;

    /**
     * Update sorting of this Drawing relative to other PrimaryCanvasGroup siblings.
     * Called when the elevation or sort order for the Drawing changes.
     */
    protected _refreshElevation(): void;

    /**
     * Refresh the border frame that encloses the Drawing.
     */
    protected _refreshFrame(): void;

    /**
     * Refresh the content and appearance of text.
     */
    protected _refreshText(): void;

    /**
     * Add a new polygon point to the drawing, ensuring it differs from the last one
     * @param position - The drawing point to add
     * @param options  - Options which configure how the point is added
     * @internal
     */
    protected _addPoint(
      position: Canvas.Point,
      options?: NullishProps<{
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
      }>,
    ): void;

    /**
     * Remove the last fixed point from the polygon
     * @internal
     */
    protected _removePoint(): void;

    protected override _onControl(options: ControlOptions): void;

    protected override _onRelease(options: HandleEmptyObject<ReleaseOptions>): void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    /**
     * Enable text editing for this drawing.
     */
    enableTextEditing(options?: NullishProps<Drawing.TextEditingOptions>): void;

    /**
     * @privateRemarks _onDelete and _onUpdate are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    override activateListeners(): void;

    /**
     * @param event - unused
     */
    protected override _canControl(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * @param user  - unused
     * @param event - unused
     */
    protected override _canConfigure(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    /**
     * Handle mouse movement which modifies the dimensions of the drawn shape
     * @internal
     */
    protected _onMouseDraw(event: PIXI.FederatedEvent): void;

    protected _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): false | void;

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
    protected _onHandleDragDrop(event: PIXI.FederatedEvent): void;

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

  namespace Drawing {
    type AnyConstructor = typeof AnyDrawing;

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Drawing>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface TextEditingOptions {
      forceTextEditing?: boolean;

      isNew?: boolean;
    }

    /** @remarks Drawing#_onControl passes its whole options object on the Drawing#enableTextEditing */
    interface ControlOptions extends TextEditingOptions, PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshTransform: boolean;

      refreshPosition: boolean;

      refreshRotation: boolean;

      refreshSize: boolean;

      refreshShape: boolean;

      refreshFrame: boolean;

      refreshText: boolean;

      refreshElevation: boolean;

      /**
       * @deprecated since v12, until v14
       */
      refreshMesh: boolean;
    }

    interface AdjustableShape {
      shape: {
        width: number;
        height: number;
        points?: Canvas.Point[] | null;
        type?: ValueOf<(typeof Drawing)["SHAPE_TYPES"]> | null;
      };
      x: number;
      y: number;
    }
  }
}

declare abstract class AnyDrawing extends Drawing {
  constructor(arg0: never, ...args: never[]);
}
