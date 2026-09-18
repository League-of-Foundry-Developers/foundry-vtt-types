import { expectTypeOf, test } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
import AmbientLightShapeControls = foundry.canvas.placeables.lights.AmbientLightShapeControls;

declare const controls: AmbientLightShapeControls;
declare const event: Canvas.Event.Pointer;

test("foundry/client/canvas/placeables/lights/shape-controls", () => {
  expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
  expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
  expectTypeOf(controls["_prepareDragDropUpdate"](event)).toEqualTypeOf<AmbientLightShapeControls.DragDropUpdate>();
  expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
});
