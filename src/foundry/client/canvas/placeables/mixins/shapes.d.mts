import type { AnyObject, FixedInstanceType, HandleEmptyObject, Mixin } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { ShapeControlsHandle } from "#client/canvas/containers/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";

/**
 * A mixin for UX shared between PlaceableObjects that have shapes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class ShapeObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The measurement lines.
   */
  protected _measurementLines: PIXI.Graphics;

  /**
   * The measurement labels.
   */
  protected _measurementLabels: PIXI.Container;

  /**
   * The solid measurement line style.
   */
  protected _measurementSolidLineStyle: PIXI.ILineStyleOptions;

  /**
   * The dashed measurement line style.
   */
  protected _measurementDashLineStyle: PIXI.ILineStyleOptions;

  /**
   * The controls handle that is currently hovered, if any.
   */
  get hoveredHandle(): ShapeControlsHandle.Any | null;

  /**
   * @internal
   */
  _hoveredHandle: ShapeControlsHandle.Any | null;

  // Mixin override.
  get bounds(): PIXI.Rectangle;

  // Mixin override.
  get center(): PIXI.Point;

  // Mixin override.
  protected _getTargetAlpha(): number;

  // Mixin override.
  protected _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  // Mixin override.
  protected _onClickLeft(event: Canvas.Event.Pointer): boolean | void;

  // Mixin override.
  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _canDragLeftStart(
    user: User.Implementation,
    event: Canvas.Event.Pointer,
    options?: PlaceableObject.CanDragLeftStartOptions,
  ): boolean;

  // Mixin override.
  protected _onDragLeftStart(event: Canvas.Event.Pointer): boolean | void;

  // Mixin override.
  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag previews. Called when the shape has changed.
   * @param event - The pointer event
   * @remarks
   * @throws If the document's schema has none of the `shapes`, `shape`, or `x`/`y` fields, in which case a
   * subclass must override this method.
   */
  protected _updateDragPreviews(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): boolean | void;

  // Mixin override.
  protected _onDragLeftCancel(event: Canvas.Event.Pointer): boolean | void;

  // Mixin override.
  protected _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Initialize the shape for dragging.
   * @param event - The pointer event
   * @returns The shape that is dragged
   */
  protected _initializeDragShape(event: Canvas.Event.Pointer): BaseShapeData;

  // Mixin override.
  protected _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): ShapeObjectMixin.DragLeftDropUpdate[];

  // Mixin override.
  protected _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): void;

  /**
   * Define a PIXI TextStyle object which is used for the measurement labels.
   */
  protected _getMeasurementTextStyle(): PIXI.TextStyle;

  /**
   * Get the shape that should be measured.
   */
  protected _getMeasuredShapes(): BaseShapeData[];

  /**
   * Format a distance that is displayed in a measurement label.
   * @param distance - The distance
   * @returns The distance label
   */
  protected _formatMeasuredDistance(distance: number): string;

  /**
   * Refresh the measurements.
   */
  protected _refreshMeasurements(): void;

  // Mixin override.
  protected _onUpdate(changed: AnyObject, options: AnyObject, userId: string): void;

  // Mixin override.
  protected _onDelete(options: AnyObject, userId: string): void;

  /**
   * Has the shape or a shape changed?
   * @param changed - The changes of the update operation
   * @returns True if the shape or a shape has changed
   * @internal
   * @remarks
   * @throws If the document's schema has neither a `shapes` nor a `shape` field, in which case a subclass must
   * override this method.
   */
  _hasShapeChanged(changed: AnyObject): boolean;

  #ShapeObject: true;
}

/**
 * A mixin for UX shared between PlaceableObjects that have shapes.
 */
declare function ShapeObjectMixin<BaseClass extends ShapeObjectMixin.BaseClass>(
  Base: BaseClass,
): ShapeObjectMixin.Mix<BaseClass>;

declare namespace ShapeObjectMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ShapeObjectMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  /**
   * A PlaceableObject constructor which can be extended by this mixin.
   * @privateRemarks Not {@linkcode PlaceableObject.AnyConstructor} as usual; that resolves through
   * {@linkcode PlaceableObject.DefaultPlaceables}, which is circular while this mixin's users are being declared.
   */
  type BaseClass = typeof PlaceableObject<PlaceableObject.AnyCanvasDocument>;

  type Mix<BaseClass extends ShapeObjectMixin.BaseClass> = Mixin<typeof ShapeObject, BaseClass>;

  /**
   * @remarks What {@linkcode ShapeObjectMixin.AnyMixed._prepareDragLeftDropUpdates | ShapeObject#_prepareDragLeftDropUpdates}
   * returns: the `shapes` form when the document's schema has a `shapes` field, the `shape` form when it has a
   * `shape` field, and the inherited position form otherwise.
   */
  type DragLeftDropUpdate =
    | { _id: string; shapes: BaseShapeData.Source[] }
    | { _id: string; shape: BaseShapeData.Source }
    | PlaceableObject.DragLeftDropUpdate;
}

export default ShapeObjectMixin;
