import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "#utils";

import ShapeControls = foundry.canvas.containers.ShapeControls;
import ShapeControlsHandle = foundry.canvas.containers.ShapeControlsHandle;

declare const shape: foundry.data.RectangleShapeData;
declare const controls: ShapeControls.Any;
declare const handle: ShapeControlsHandle;
declare const graphics: PIXI.Graphics;
declare const event: foundry.canvas.Canvas.Event.Pointer;
declare const drawing: foundry.canvas.placeables.Drawing.Implementation;

expectTypeOf(new ShapeControls(shape).shape).toEqualTypeOf<foundry.data.RectangleShapeData>();
new ShapeControlsHandle(controls, "translate");

expectTypeOf(controls.shape).toEqualTypeOf<foundry.data.BaseShapeData>();
expectTypeOf(controls.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(controls.object).toEqualTypeOf<foundry.canvas.placeables.PlaceableObject>();
expectTypeOf(controls.layer).toEqualTypeOf<foundry.canvas.layers.PlaceablesLayer.Any>();
expectTypeOf(controls.border).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(controls.handles).toEqualTypeOf<PIXI.Container<ShapeControlsHandle>>();
expectTypeOf(controls.tint).toBeNumber();
controls.tint = 0xffffff;
controls.tint = "#ff0000";
expectTypeOf(controls.editable).toBeBoolean();
expectTypeOf(controls.dashed).toBeBoolean();
controls.dashed = true;
expectTypeOf(controls.applyRenderFlags()).toBeVoid();
expectTypeOf(ShapeControls.RENDER_FLAG_PRIORITY).toEqualTypeOf<foundry.canvas.interaction.RenderFlags.Priority>();
expectTypeOf(ShapeControls.RENDER_FLAGS.redraw).toEqualTypeOf<
  foundry.canvas.interaction.RenderFlag<ShapeControls.RENDER_FLAGS, "redraw">
>();
expectTypeOf(ShapeControls.RENDER_FLAGS.refresh).toEqualTypeOf<
  foundry.canvas.interaction.RenderFlag<ShapeControls.RENDER_FLAGS, "refresh">
>();
expectTypeOf(controls.renderFlags).toEqualTypeOf<foundry.canvas.interaction.RenderFlags<ShapeControls.RENDER_FLAGS>>();
expectTypeOf(controls.renderFlags.clear()).toEqualTypeOf<Partial<Record<"redraw" | "refresh", true>>>();
controls.renderFlags.set({ redraw: true, refresh: null });

// @ts-expect-error An unregistered flag throws at runtime.
controls.renderFlags.set({ refreshShape: true });

expectTypeOf(controls["_refresh"]()).toBeVoid();
expectTypeOf(controls.refresh()).toBeVoid();
expectTypeOf(controls["_drawShape"](graphics)).toBeVoid();
expectTypeOf(controls.draw()).toEqualTypeOf<Promise<ShapeControls.Any>>();
expectTypeOf(controls["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(controls["_clear"]()).toBeVoid();
expectTypeOf(controls.destroy()).toBeVoid();
expectTypeOf(controls.destroy(true)).toBeVoid();
expectTypeOf(controls.destroy({ children: true })).toBeVoid();
expectTypeOf(controls["_canDragStart"](event)).toBeBoolean();
expectTypeOf(controls["_canDragStart"](event, { notify: false })).toBeBoolean();
expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
expectTypeOf(
  ShapeControls._createDragPreview(drawing),
).toEqualTypeOf<foundry.canvas.placeables.Drawing.Implementation>();
expectTypeOf(controls["_onDragMove"](event)).toBeVoid();
expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
type ExpectedDragDropUpdate = AnyMutableObject | [data: AnyMutableObject, options?: AnyMutableObject | undefined];
expectTypeOf<ShapeControls.DragDropUpdate>().toExtend<ExpectedDragDropUpdate>();
expectTypeOf<ExpectedDragDropUpdate>().toExtend<ShapeControls.DragDropUpdate>();
expectTypeOf(controls["_prepareDragDropUpdate"](event)).toExtend<ShapeControls.DragDropUpdate>();
expectTypeOf(controls["_onDragCancel"](event)).toBeVoid();
expectTypeOf(controls["_onClick2"](event)).toBeVoid();

class CustomShapeControls extends ShapeControls<
  foundry.abstract.Document.Any,
  foundry.canvas.placeables.PlaceableObject.Any,
  foundry.canvas.layers.PlaceablesLayer.Any,
  foundry.data.RectangleShapeData
> {
  protected override _drawShape(graphics: PIXI.Graphics): void {
    graphics.drawRect(0, 0, 100, 100);
  }

  protected override _refresh(): void {
    this.border.clear();
  }

  protected override _canDragStart(
    _event: foundry.canvas.Canvas.Event.Pointer,
    options?: foundry.canvas.placeables.PlaceableObject.CanDragLeftStartOptions,
  ): boolean {
    return this.editable && options?.notify !== false;
  }

  protected override _prepareDragDropUpdate(_event: foundry.canvas.Canvas.Event.Pointer): ShapeControls.DragDropUpdate {
    return [{ shape: this.shape.toObject() }, { diff: false }];
  }

  protected override _onClick2(_event: foundry.canvas.Canvas.Event.Pointer): void {}
}

expectTypeOf(new CustomShapeControls(shape).shape).toEqualTypeOf<foundry.data.RectangleShapeData>();
expectTypeOf(new CustomShapeControls(shape).renderFlags).toEqualTypeOf<
  foundry.canvas.interaction.RenderFlags<ShapeControls.RENDER_FLAGS>
>();

expectTypeOf(handle.controls).toEqualTypeOf<ShapeControls.Any>();
expectTypeOf(handle.hovered).toBeBoolean();
expectTypeOf(handle.draw({ size: 10, outlineThickness: 1 })).toEqualTypeOf<Promise<void>>();
