import type { AnyMutableObject, FixedInstanceType, Mixin } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type PlaceablesLayer from "../base/placeables-layer.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";

/**
 * A mixin for UX shared between PlaceablesLayer with objects that have shapes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class ShapeLayer {
  /** @privateRemarks All mixin classes should accept anything for their constructor. */
  constructor(...args: any[]);

  // Mixin override.
  static get layerOptions(): ShapeLayerMixin.LayerOptions.Any;

  /**
   * The mouse wheel context.
   * @internal
   */
  _mouseWheelContext: ShapeLayerMixin.MouseWheelContext | null;

  // Mixin override.
  getSnappedPoint(point: Canvas.Point): Canvas.Point;

  // Mixin override.
  protected _deactivate(): void;

  // Mixin override.
  protected _tearDown(options: PlaceablesLayer.TearDownOptions): Promise<void>;

  // Mixin override.
  protected _onClickLeft(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  // Mixin override.
  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _commitDragLeftDrop(event: Canvas.Event.Pointer): Promise<void>;

  // Mixin override.
  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Create the shape data from the drag start event.
   * @param event - The pointer event
   * @returns The initial shape data
   */
  protected _createDragShapeData(event: Canvas.Event.Pointer): AnyMutableObject;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreview(event: Canvas.Event.Pointer): void;

  // Mixin override.
  protected _onMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Cancel mouse wheel rotation.
   */
  protected _cancelMouseWheel(): void;

  /**
   * Rotate the shape of the preview.
   * @param event - The mouse wheel event
   */
  protected _updateMouseWheelShape(event: Canvas.Event.Wheel): void;

  /**
   * Update the mouse wheel rotation preview.
   */
  protected _updateMouseWheelPreview(): void;

  /**
   * Prepare the database update that should occur as the result of a mouse wheel rotation.
   * @returns The update data and options (optional)
   */
  protected _prepareMouseWheelUpdate():
    | AnyMutableObject
    | [data: AnyMutableObject, options?: AnyMutableObject | undefined];

  #ShapeLayer: true;
}

/**
 * A mixin for UX shared between PlaceablesLayer with objects that have shapes.
 * @param Base - The PlaceablesLayer (sub)class.
 */
declare function ShapeLayerMixin<BaseClass extends ShapeLayerMixin.BaseClass>(
  Base: BaseClass,
): ShapeLayerMixin.Mix<BaseClass>;

declare namespace ShapeLayerMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ShapeLayerMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PlaceablesLayer.AnyConstructor;

  type Mix<BaseClass extends ShapeLayerMixin.BaseClass> = Mixin<typeof ShapeLayer, BaseClass>;

  interface LayerOptions<
    ConcretePlaceableClass extends PlaceableObject.AnyConstructor,
  > extends PlaceablesLayer.LayerOptions<ConcretePlaceableClass> {
    /**
     * The shape types that are allowed to be empty for the creation of a drawn object.
     * @defaultValue `[]`
     */
    allowedEmptyShapes: string[];

    /**
     * Discard the closing point of a polygon shape?
     * @defaultValue `true`
     */
    discardClosingPoint: boolean;
  }

  namespace LayerOptions {
    interface Any extends LayerOptions<any> {}
  }

  interface MouseWheelContext {
    preview: PlaceableObject.Any;
    shape: BaseShapeData;
  }
}

export default ShapeLayerMixin;
