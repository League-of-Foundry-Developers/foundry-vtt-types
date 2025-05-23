import type { ValueOf, FixedInstanceType, HandleEmptyObject, RequiredProps, NullishProps } from "#utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * The Drawing object is an implementation of the PlaceableObject container.
   * Each Drawing is a placeable object in the DrawingsLayer.
   */
  class Drawing extends PlaceableObject<DrawingDocument.Implementation> {
    // fake override; super has to type as if this could be a ControlIcon, but Drawings don't use one
    override controlIcon: null;

    /**
     * The texture that is used to fill this Drawing, if any.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw. Set `null` if the Drawing's document has no `texture` set
     */
    texture: PIXI.Texture | null | undefined;

    /**
     * The border frame and resizing handles for the drawing.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     */
    frame: PIXI.Container | undefined;

    /**
     * A text label that may be displayed as part of the interface layer for the Drawing.
     * @defaultValue `null`
     */
    text: PreciseText | null;

    /**
     * The drawing shape which is rendered as a PIXI.Graphics in the interface or a PrimaryGraphics in the Primary Group.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     */
    shape: PrimaryGraphics | PIXI.Graphics | undefined;

    static override embeddedName: "Drawing";

    static override RENDER_FLAGS: Drawing.RENDER_FLAGS;

    // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
    // `RENDER_FLAGS` and so it has to be adjusted here.
    renderFlags: RenderFlags<Drawing.RENDER_FLAGS>;

    /**
     * The rate at which points are sampled (in milliseconds) during a freehand drawing workflow
     * @defaultValue `75`
     */
    static FREEHAND_SAMPLE_RATE: number;

    /**
     * A convenience reference to the possible shape types.
     */
    static SHAPE_TYPES: foundry.data.ShapeData.TYPES;

    /**
     * A convenient reference for whether the current User is the author of the Drawing document.
     */
    get isAuthor(): boolean;

    /**
     * Is this Drawing currently visible on the Canvas?
     */
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
    get type(): ValueOf<foundry.data.ShapeData.TYPES>;

    /**
     * The pending text.
     * @defaultValue `undefined`
     * @remarks Foundry marked `@internal`
     */
    protected _pendingText: string | undefined;

    /**
     * The registered keydown listener.
     * @defaultValue `null`
     * @remarks Foundry marked `@internal`
     */
    protected _onkeydown: ((event: KeyboardEvent) => void) | null;

    protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

    protected override _draw(options: HandleEmptyObject<Drawing.DrawOptions> | undefined): Promise<void>;

    /**
     * Get the line style used for drawing the shape of this Drawing.
     * @returns The line style options (`PIXI.ILineStyleOptions`).
     * @privateRemarks Foundry types this return as just `object` and then lists the correct interface this is a partial of in the `@returns`?!
     */
    protected _getLineStyle(): Drawing.LineStyleData;

    /**
     * Get the fill style used for drawing the shape of this Drawing.
     * @returns The fill style options (`PIXI.IFillStyleOptions`).
     * @privateRemarks Foundry types this return as just `object` and then lists the correct interface this is a partial of in the `@returns`?!
     */
    protected _getFillStyle(): Drawing.FillStyleData;

    /**
     * Prepare the text style used to instantiate a PIXI.Text or PreciseText instance for this Drawing document.
     */
    protected _getTextStyle(): PIXI.TextStyle;

    override clone(): this;

    // fake override; super has to account for misbehaving siblings returning void
    override clear(): this;

    protected override _applyRenderFlags(flags: Drawing.RenderFlags): void;

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
     * @remarks Foundry marked `@internal`
     */
    // options: not null (destructured)
    protected _addPoint(position: Canvas.Point, options?: Drawing.AddPointOptions): void;

    /**
     * Remove the last fixed point from the polygon
     * @remarks Foundry marked `@internal`
     */
    protected _removePoint(): void;

    protected override _onControl(options: Drawing.ControlOptions): void;

    protected override _onRelease(options: HandleEmptyObject<Drawing.ReleaseOptions>): void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    /**
     * Enable text editing for this drawing.
     */
    enableTextEditing(options?: Drawing.EnableTextEditingOptions): void;

    // _onUpdate and _onDelete are overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    override activateListeners(): void;

    protected override _canControl(user: User.Implementation, _event: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(_user: User.Implementation, _event: PIXI.FederatedEvent): boolean;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    // options: not null (destructured)
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): void;

    /**
     * Handle mouse movement which modifies the dimensions of the drawn shape
     * @remarks Foundry marked `@internal`
     */
    protected _onMouseDraw(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PIXI.FederatedEvent): void;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[];

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     */
    protected _onHandleHoverIn(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     */
    protected _onHandleHoverOut(event: PIXI.FederatedEvent): void;

    /**
     * Starting the resize handle drag event, initialize the original data.
     */
    protected _onHandleDragStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle mousemove while dragging a tile scale handler
     * @param event - The mousemove event
     */
    protected _onHandleDragMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouseup after dragging a tile scale handler
     * @param event - The mouseup event
     */
    protected _onHandleDragDrop(event: PIXI.FederatedEvent): void;

    /**
     * Handle cancellation of a drag event for one of the resizing handles
     */
    protected _onHandleDragCancel(event: PIXI.FederatedEvent): void;

    /**
     * Get a vectorized rescaling transformation for drawing data and dimensions passed in parameter
     * @param original - The original drawing data
     * @param dx       - The pixel distance dragged in the horizontal direction
     * @param dy       - The pixel distance dragged in the vertical direction
     * @returns The adjusted shape data
     */
    static rescaleDimensions(original: DrawingDocument.Source, dx: number, dy: number): DrawingDocument.Source;

    /**
     * Adjust the location, dimensions, and points of the Drawing before committing the change
     * @param data - The DrawingData pending update
     * @returns The adjusted data
     * @remarks This is intentionally public because it is called by the DrawingsLayer
     * @internal
     */
    static normalizeShape(data: DrawingDocument.Source): DrawingDocument.Source;
  }

  namespace Drawing {
    // eslint-disable-next-line no-restricted-syntax
    interface ObjectClass extends ConfiguredObjectClassOrDefault<typeof Drawing> {}
    interface Object extends FixedInstanceType<ObjectClass> {}

    /**
     * @deprecated {@link Drawing.ObjectClass | `Drawing.ObjectClass`}
     */
    type ConfiguredClass = ObjectClass;

    /**
     * @deprecated {@link Drawing.Object | `Drawing.Object`}
     */
    type ConfiguredInstance = Object;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Drawing` (the `PlaceableObject` that appears on the canvas) and
     * `DrawingDocument` (the `Document` that represents the data for a `Drawing`) is so common that
     * it is useful to have a type to forward to `DrawingDocument`.
     *
     * @deprecated {@link DrawingDocument.Implementation | `DrawingDocument.Implementation`}
     */
    type Implementation = DrawingDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `Drawing` (the `PlaceableObject` that appears on the canvas) and
     * `DrawingDocument` (the `Document` that represents the data for a `Drawing`) is so common that
     * it is useful to have a type to forward to `DrawingDocument`.
     *
     * @deprecated {@link DrawingDocument.ImplementationClass | `DrawingDocument.ImplementationClass`}
     */
    type ImplementationClass = DrawingDocument.ImplementationClass;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this, "redraw">;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshText", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<this, "refresh">;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this, "refreshState">;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
      refreshTransform: RenderFlag<this, "refreshTransform">;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<this, "refreshPosition">;

      /** @defaultValue `{ propagate: ["refreshFrame"] }` */
      refreshRotation: RenderFlag<this, "refreshRotation">;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshFrame", "refreshShape", "refreshText"] }` */
      refreshSize: RenderFlag<this, "refreshSize">;

      /** @defaultValue `{}` */
      refreshShape: RenderFlag<this, "refreshShape">;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<this, "refreshText">;

      /** @defaultValue `{}` */
      refreshFrame: RenderFlag<this, "refreshFrame">;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<this, "refreshElevation">;

      /**
       * @defaultValue
       * ```js
       * {
       *   propagate: ["refreshTransform", "refreshShape", "refreshElevation"],
       *   deprecated: { since: 12, until: 14, alias: true }
       * }
       * ```
       * @deprecated since v12, until v14
       * @remarks The `alias: true` should be a sibling of `deprecated`, not a child, this is a Foundry bug in 12.331
       */
      refreshMesh: RenderFlag<this, "refreshMesh">;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends _EnableTextEditingOptions, PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    type LineStyleData = RequiredProps<PIXI.ILineStyleOptions, "width" | "color" | "alpha">;

    /** @remarks Conditionally includes `texture`, which is already optional in the interface */
    type FillStyleData = RequiredProps<PIXI.IFillStyleOptions, "color" | "alpha">;

    /** @internal */
    type _AddPointOptions = NullishProps<{
      /**
       * Should the point be rounded to integer coordinates?
       * @defaultValue `false`
       */
      round: boolean;

      /**
       * Should the point be snapped to grid precision?
       * @defaultValue `false`
       */
      snap: boolean;

      /**
       * Is this a temporary control point?
       * @defaultValue `false`
       */
      temporary: boolean;
    }>;

    interface AddPointOptions extends _AddPointOptions {}

    /** @internal */
    type _EnableTextEditingOptions = NullishProps<{
      forceTextEditing: boolean;
      isNew: boolean;
    }>;

    interface EnableTextEditingOptions extends _EnableTextEditingOptions {}
  }
}
