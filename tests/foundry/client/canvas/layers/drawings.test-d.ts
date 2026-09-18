import { expectTypeOf, test } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import DrawingPalette = foundry.applications.sheets.palette.DrawingPalette;

import DrawingsLayer = foundry.canvas.layers.DrawingsLayer;
import Canvas = foundry.canvas.Canvas;
import DrawingHUD = foundry.applications.hud.DrawingHUD;
import Drawing = foundry.canvas.placeables.Drawing;

declare const somePoint: PIXI.IPointData;

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;

test("foundry/client/canvas/layers/drawings", () => {
  expectTypeOf(DrawingsLayer.documentName).toEqualTypeOf<"Drawing">();
  expectTypeOf(DrawingsLayer.instance).toEqualTypeOf<DrawingsLayer | undefined>();
  expectTypeOf(DrawingsLayer.layerOptions).toEqualTypeOf<DrawingsLayer.LayerOptions>();
  expectTypeOf(DrawingsLayer.layerOptions.name).toEqualTypeOf<"drawings">();
  expectTypeOf(DrawingsLayer.layerOptions.objectClass).toEqualTypeOf<Drawing.ImplementationClass>();

  const layer = new DrawingsLayer();

  expectTypeOf(layer.options.objectClass).toEqualTypeOf<Drawing.ImplementationClass>();
  expectTypeOf(layer.options).toEqualTypeOf<DrawingsLayer.LayerOptions>();
  expectTypeOf(layer.options.name).toEqualTypeOf<"drawings">();

  expectTypeOf(layer.graphics).toEqualTypeOf<Collection<Drawing.Implementation>>();
  expectTypeOf(layer.hud).toEqualTypeOf<DrawingHUD>();
  expectTypeOf(layer.hookName).toEqualTypeOf<"DrawingsLayer">();
  expectTypeOf(layer.getSnappedPoint(somePoint)).toEqualTypeOf<Canvas.Point>();

  expectTypeOf(layer["_deactivate"]()).toBeVoid();
  expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

  expectTypeOf(layer["_getNewDrawingData"](somePoint)).toEqualTypeOf<DrawingDocument.CreateData>();
  expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
  expectTypeOf(layer["_createDragPreviewData"](pointerEvent)).toEqualTypeOf<DrawingDocument.CreateData>();
  expectTypeOf(layer["_createDragShapeData"](pointerEvent)).toEqualTypeOf<AnyMutableObject>();
  expectTypeOf(layer["_updateDragPreview"](pointerEvent)).toBeVoid();
  expectTypeOf(layer["_updateMouseWheelPreview"]()).toBeVoid();

  expectTypeOf(DrawingsLayer.paletteClass).toEqualTypeOf<typeof DrawingPalette>();
  expectTypeOf(DrawingsLayer.layerOptions.allowedEmptyShapes).toEqualTypeOf<string[]>();
  expectTypeOf(DrawingsLayer.layerOptions.discardClosingPoint).toEqualTypeOf<false>();

  Hooks.on("pasteDrawing", (objects, data, options) => {
    expectTypeOf(objects).toEqualTypeOf<Drawing.Implementation[]>();
    expectTypeOf(data).toEqualTypeOf<DrawingDocument.Source[]>();
    expectTypeOf(options).toEqualTypeOf<Hooks.PastePlaceableObjectOptions>();
  });
});
