import { expectTypeOf } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
import RegionShapeControls = foundry.canvas.placeables.regions.RegionShapeControls;

declare const controls: RegionShapeControls;
declare const event: Canvas.Event.Pointer;

expectTypeOf(controls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(controls["_onClick2"](event)).toBeVoid();
