import type { AnyMutableObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import { RenderFlagsMixin, type RenderFlags, type RenderFlag } from "#client/canvas/interaction/_module.mjs";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a shape.
 */
declare class ShapeControls<
  DocumentClass extends Document.Any,
  ObjectClass extends PlaceableObject.Any,
  LayerClass extends PlaceablesLayer.Any,
  ShapeClass extends BaseShapeData,
> extends RenderFlagsMixin<typeof PIXI.Container>(PIXI.Container) {
  /**
   * @param shape - The shape.
   */
  constructor(shape: ShapeClass);

  /** @defaultValue `"INTERFACE"` */
  static override RENDER_FLAG_PRIORITY: RenderFlags.Priority;

  static override RENDER_FLAGS: ShapeControls.RENDER_FLAGS;

  // fake type override
  override renderFlags: RenderFlags<ShapeControls.RENDER_FLAGS>;

  /** The shape. */
  get shape(): ShapeClass;

  /** The Document of this shape. */
  get document(): DocumentClass;

  /** The PlaceableObject of this shape. */
  get object(): ObjectClass;

  /** The PlaceableLayer of this shape. */
  get layer(): LayerClass;

  /** The border of the shape. */
  get border(): PIXI.Graphics;

  /** The handles of the shape. */
  get handles(): PIXI.Container<ShapeControlsHandle>;

  /**
   * The tint applied to these controls.
   * @defaultValue `0xFFFFFF`
   */
  get tint(): number;

  set tint(tint: PIXI.ColorSource);

  /**
   * Are the controls editable?
   * @defaultValue `true`
   */
  editable: boolean;

  /**
   * Is the border dashed?
   * @defaultValue `false`
   */
  get dashed(): boolean;

  set dashed(value: boolean);

  override applyRenderFlags(): void;

  /** Refresh the visualization of these controls. */
  protected _refresh(): void;

  /** Refresh the visualization of these controls. */
  refresh(): void;

  /**
   * Draw the shape.
   */
  protected _drawShape(graphics: PIXI.Graphics): void;

  /** Draw the visualization of these controls. */
  draw(): Promise<this>;

  /** Draw these controls. */
  protected _draw(): Promise<void>;

  /** Clear these controls. */
  protected _clear(): void;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * Can the handle be dragged?
   * @param event   - The pointer event
   * @param options - Options, used internally
   */
  protected _canDragStart(event: Canvas.Event.Pointer, options?: PlaceableObject.CanDragLeftStartOptions): boolean;

  /**
   * Handle the drag start event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragStart(event: Canvas.Event.Pointer): void;

  /**
   * Create and draw the drag preview for a placeable object.
   * @param object - The original placeable object
   * @returns The preview of the placeable object.
   * @internal
   */
  static _createDragPreview<ObjectClass extends PlaceableObject.Any>(object: ObjectClass): ObjectClass;

  /**
   * Handle the drag move event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event.
   * @throws If {@linkcode ShapeControls.document | this.document} has neither a `shapes` nor a `shape` field.
   */
  protected _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected _onDragDrop(event: Canvas.Event.Pointer): void;

  /**
   * Prepare the database update that should occur as the result of a drop operation.
   * @param event - The pointer event.
   * @returns The update data and options (optional)
   * @throws If {@linkcode ShapeControls.document | this.document} has neither a `shapes` nor a `shape` field.
   * @remarks Only the plain-object form survives: {@linkcode ShapeControls._onDragDrop | ShapeControls#_onDragDrop}
   * normalizes with `Array.isArray(result[0])`, so the tuple form is wrapped again and its options are dropped.
   */
  protected _prepareDragDropUpdate(event: Canvas.Event.Pointer): ShapeControls.DragDropUpdate;

  /**
   * Handle the drag cancel event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle the double left-click event of a handle.
   * @param event - The pointer event.
   */
  protected _onClick2(event: Canvas.Event.Pointer): void;

  #ShapeControls: true;
}

declare namespace ShapeControls {
  interface Any extends AnyShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyShapeControls> {}

  interface RENDER_FLAGS extends RenderFlagsMixin.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }

  /**
   * @remarks Mutable because {@linkcode foundry.abstract.Document.update | Document#update} stamps `_id` onto the
   * data and `parent`/`pack` onto the options.
   */
  type DragDropUpdate = AnyMutableObject | [data: AnyMutableObject, options?: AnyMutableObject | undefined];
}

/**
 * A handle of a shape controls element.
 */
declare class ShapeControlsHandle extends PIXI.smooth.SmoothGraphics {
  /**
   * @param controls - The controls this handle belongs to.
   * @param name     - The name of this handle.
   */
  constructor(controls: ShapeControls.Any, name: string);

  /** The controls that this handle belongs to. */
  get controls(): ShapeControls.Any;

  /** Is hovered? */
  get hovered(): boolean;

  /**
   * Draw the handle.
   * @param style - The style.
   */
  draw(style: ShapeControlsHandle.DrawStyle): Promise<void>;

  #ShapeControlsHandle: true;
}

declare namespace ShapeControlsHandle {
  interface Any extends AnyShapeControlsHandle {}
  interface AnyConstructor extends Identity<typeof AnyShapeControlsHandle> {}

  interface DrawStyle {
    size: number;
    offset?: number | undefined;
    outlineThickness: number;
  }
}

export { ShapeControls, ShapeControlsHandle };

declare abstract class AnyShapeControls extends ShapeControls<
  Document.Any,
  PlaceableObject.Any,
  PlaceablesLayer.Any,
  BaseShapeData
> {
  constructor(...args: never);
}

declare abstract class AnyShapeControlsHandle extends ShapeControlsHandle {
  constructor(...args: never);
}
