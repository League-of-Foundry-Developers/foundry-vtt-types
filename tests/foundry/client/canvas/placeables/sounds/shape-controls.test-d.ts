import { expectTypeOf } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
import AmbientSoundShapeControls = foundry.canvas.placeables.sounds.AmbientSoundShapeControls;

declare const controls: AmbientSoundShapeControls;
declare const event: Canvas.Event.Pointer;

expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_prepareDragDropUpdate"](event)).toEqualTypeOf<AmbientSoundShapeControls.DragDropUpdate>();
expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
