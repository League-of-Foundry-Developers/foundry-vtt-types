import type { FixedInstanceType, HandleEmptyObject, InexactPartial, RequiredProps, ValueOf } from "#utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { PrimaryGraphics } from "#client/canvas/primary/_module.d.mts";
import type { PreciseText } from "#client/canvas/containers/_module.mjs";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { ShapeData } from "#client/data/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Drawing: Drawing.Implementation;
    }
  }
}

/**
 * The Drawing object is an implementation of the PlaceableObject container.
 * Each Drawing is a placeable object in the DrawingsLayer.
 * @see {@linkcode foundry.documents.DrawingDocument}
 * @see {@linkcode foundry.canvas.layers.DrawingsLayer}
 */
declare class Drawing extends PlaceableObject<DrawingDocument.Implementation> {
  // fake type override
  static override get implementation(): Drawing.ImplementationClass;

  // fake override; super has to type as if this could be a ControlIcon, but Drawings don't use one
  override controlIcon: null;

  /**
   * The texture that is used to fill this Drawing, if any.
   * @defaultValue `null`
   * @remarks Set `null` if the `Drawing`'s document has no {@linkcode DrawingDocument.texture | texture} set
   */
  texture: PIXI.Texture | null;

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

  /**
   * An internal flag for the permanent points of the polygon.
   * @internal
   */
  _fixedPoints: number[];

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
  static SHAPE_TYPES: ShapeData.TYPES;

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
  get type(): ValueOf<ShapeData.TYPES>;

  /**
   * The pending text.
   * @defaultValue `undefined`
   * @internal
   */
  _pendingText: string | undefined;

  /**
   * The registered keydown listener.
   * @defaultValue `null`
   * @internal
   */
  _onkeydown: ((event: KeyboardEvent) => void) | null;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  override clear(): this;

  // fake type override
  override draw(options?: HandleEmptyObject<Drawing.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<Drawing.DrawOptions> | undefined): Promise<void>;

  /**
   * Get the line style used for drawing the shape of this Drawing.
   * @returns The line style options ({@linkcode PIXI.ILineStyleOptions}).
   * @privateRemarks Foundry types this return as just `object` and then lists the correct interface this is a partial of in the `@returns`?!
   */
  protected _getLineStyle(): Drawing.LineStyleData;

  /**
   * Get the fill style used for drawing the shape of this Drawing.
   * @returns The fill style options ({@linkcode PIXI.IFillStyleOptions}).
   * @privateRemarks Foundry types this return as just `object` and then lists the correct interface this is a partial of in the `@returns`?!
   */
  protected _getFillStyle(): Drawing.FillStyleData;

  /**
   * Prepare the text style used to instantiate a {@linkcode PIXI.Text} or {@linkcode PreciseText} instance for this Drawing document.
   */
  protected _getTextStyle(): PIXI.TextStyle;

  override clone(): this;

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
   * @internal
   */
  _addPoint(position: Canvas.Point, options?: Drawing.AddPointOptions): void;

  /**
   * Remove the last fixed point from the polygon
   * @internal
   */
  _removePoint(): void;

  // fake type override
  override control(options?: Drawing.ControlOptions): boolean;

  protected override _onControl(options: Drawing.ControlOptions): void;

  // fake type override
  override release(options?: HandleEmptyObject<Drawing.ReleaseOptions>): boolean;

  protected override _onRelease(options: HandleEmptyObject<Drawing.ReleaseOptions>): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  /**
   * Enable text editing for this drawing.
   */
  enableTextEditing(options?: Drawing.EnableTextEditingOptions): void;

  override _onUpdate(
    changed: DrawingDocument.UpdateData,
    options: DrawingDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  override _onDelete(options: DrawingDocument.Database.OnDeleteOptions, userId: string): void;

  override activateListeners(): void;

  protected override _canControl(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _onHoverIn(event: Canvas.Event.Pointer, options?: PlaceableObject.HoverInOptions): void;

  /**
   * Handle mouse movement which modifies the dimensions of the drawn shape
   */
  protected _onMouseDraw(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.DragLeftDropUpdate[];

  /**
   * Handle mouse-over event on a control handle
   * @param event - The mouseover event
   */
  protected _onHandleHoverIn(event: PIXI.FederatedEvent<PointerEvent>): void;

  /**
   * Handle mouse-out event on a control handle
   * @param event - The mouseout event
   */
  protected _onHandleHoverOut(event: PIXI.FederatedEvent<PointerEvent>): void;

  /**
   * Starting the resize handle drag event, initialize the original data.
   */
  protected _onHandleDragStart(event: Canvas.Event.Pointer): void;

  /**
   * Handle mousemove while dragging a tile scale handler
   * @param event - The mousemove event
   */
  protected _onHandleDragMove(event: Canvas.Event.Pointer): void;

  /**
   * Handle mouseup after dragging a tile scale handler
   * @param event - The mouseup event
   */
  protected _onHandleDragDrop(event: Canvas.Event.Pointer): void;

  /**
   * Handle cancellation of a drag event for one of the resizing handles
   */
  protected _onHandleDragCancel(event: Canvas.Event.Pointer): void;

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

  #Drawing: true;
}

declare namespace Drawing {
  /**
   * The implementation of the `Drawing` placeable configured through `CONFIG.Drawing.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode DrawingDocument.Implementation}
   * which refers to the implementation for the drawing document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Drawing` placeable configured through `CONFIG.Drawing.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode DrawingDocument.ImplementationClass}
   * which refers to the implementation for the drawing document.
   */
  // eslint-disable-next-line no-restricted-syntax
  type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Drawing>;

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

  /**
   * {@linkcode Drawing._onControl | Drawing#_onControl} forwards its options to {@linkcode Drawing.enableTextEditing | #enableTextEditing}.
   */
  interface ControlOptions extends EnableTextEditingOptions, PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  type LineStyleData = RequiredProps<PIXI.ILineStyleOptions, "width" | "color" | "alpha">;

  /** @remarks Conditionally includes `texture`, which is already optional in the interface */
  type FillStyleData = RequiredProps<PIXI.IFillStyleOptions, "color" | "alpha">;

  /** @internal */
  interface _AddPointOptions {
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
  }

  interface AddPointOptions extends InexactPartial<_AddPointOptions> {}

  /** @internal */
  interface _EnableTextEditingOptions {
    forceTextEditing: boolean;
    isNew: boolean;
  }

  interface EnableTextEditingOptions extends InexactPartial<_EnableTextEditingOptions> {}
}

export default Drawing;
