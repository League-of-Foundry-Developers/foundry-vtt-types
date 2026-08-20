import { expectTypeOf } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
// Foundry does not re-export the `tiles` module from `placeables/_module.mjs`, so there's no namespace path to this class.
import TileShapeControls from "#client/canvas/placeables/tiles/shape-controls.mjs";

declare const controls: TileShapeControls;
declare const event: Canvas.Event.Pointer;

expectTypeOf(controls["_onDragStart"](event)).toBeVoid();
expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_prepareDragDropUpdate"](event)).toEqualTypeOf<TileShapeControls.DragDropUpdate>();
expectTypeOf(controls["_onDragDrop"](event)).toBeVoid();
expectTypeOf(controls["_onClick2"](event)).toBeVoid();
