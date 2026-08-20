import { expectTypeOf } from "vitest";

import type { Canvas } from "#client/canvas/_module.d.mts";
import DrawingShapeControls = foundry.canvas.placeables.drawings.DrawingShapeControls;
import AmbientLightShapeControls = foundry.canvas.placeables.lights.AmbientLightShapeControls;
import AmbientSoundShapeControls = foundry.canvas.placeables.sounds.AmbientSoundShapeControls;
import TileShapeControls from "#client/canvas/placeables/tiles/shape-controls.mjs";
import RegionShapeControls = foundry.canvas.placeables.regions.RegionShapeControls;

declare const drawingControls: DrawingShapeControls;
declare const lightControls: AmbientLightShapeControls;
declare const soundControls: AmbientSoundShapeControls;
declare const tileControls: TileShapeControls;
declare const regionControls: RegionShapeControls;
declare const event: Canvas.Event.Pointer;
declare const graphics: PIXI.Graphics;

expectTypeOf(drawingControls["_drawShape"](graphics)).toBeVoid();
expectTypeOf(drawingControls["_onDragStart"](event)).toBeVoid();
expectTypeOf(drawingControls["_onDragMove"](event)).toBeVoid();
expectTypeOf(drawingControls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(drawingControls["_prepareDragDropUpdate"](event)).toEqualTypeOf<DrawingShapeControls.DragDropUpdate>();
expectTypeOf(drawingControls["_onDragDrop"](event)).toBeVoid();
expectTypeOf(drawingControls["_onClick2"](event)).toBeVoid();

expectTypeOf(lightControls["_onDragStart"](event)).toBeVoid();
expectTypeOf(lightControls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(lightControls["_prepareDragDropUpdate"](event)).toEqualTypeOf<AmbientLightShapeControls.DragDropUpdate>();
expectTypeOf(lightControls["_onDragDrop"](event)).toBeVoid();

expectTypeOf(soundControls["_onDragStart"](event)).toBeVoid();
expectTypeOf(soundControls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(soundControls["_prepareDragDropUpdate"](event)).toEqualTypeOf<AmbientSoundShapeControls.DragDropUpdate>();
expectTypeOf(soundControls["_onDragDrop"](event)).toBeVoid();

expectTypeOf(tileControls["_onDragStart"](event)).toBeVoid();
expectTypeOf(tileControls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(tileControls["_prepareDragDropUpdate"](event)).toEqualTypeOf<TileShapeControls.DragDropUpdate>();
expectTypeOf(tileControls["_onDragDrop"](event)).toBeVoid();
expectTypeOf(tileControls["_onClick2"](event)).toBeVoid();

expectTypeOf(regionControls["_updateDragPreview"](event)).toBeVoid();
expectTypeOf(regionControls["_onClick2"](event)).toBeVoid();
