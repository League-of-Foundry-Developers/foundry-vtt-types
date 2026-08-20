import { expectTypeOf } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
import DrawingShapeControls = foundry.canvas.placeables.drawings.DrawingShapeControls;

declare const controls: DrawingShapeControls;
declare const event: Canvas.Event.Pointer;
declare const graphics: PIXI.Graphics;

expectTypeOf(controls["_drawShape"](graphics)).toBeVoid();
expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
expectTypeOf(controls["_onDragMove"](event)).toBeVoid();
expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_prepareDragDropUpdate"](event)).toEqualTypeOf<DrawingShapeControls.DragDropUpdate>();
expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
expectTypeOf(controls["_onClick2"](event)).toBeVoid();
