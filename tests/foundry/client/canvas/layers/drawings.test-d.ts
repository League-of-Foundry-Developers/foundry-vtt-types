import { expectTypeOf } from "vitest";
import { DrawingsLayer } from "#client/canvas/layers/_module.mjs";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";

import Canvas = foundry.canvas.Canvas;
import DrawingHUD = foundry.applications.hud.DrawingHUD;

expectTypeOf(DrawingsLayer.documentName).toEqualTypeOf<"Drawing">();
expectTypeOf(DrawingsLayer.instance).toEqualTypeOf<DrawingsLayer | undefined>();
expectTypeOf(DrawingsLayer.layerOptions).toEqualTypeOf<DrawingsLayer.LayerOptions>();
expectTypeOf(DrawingsLayer.layerOptions.name).toEqualTypeOf<"drawings">();
expectTypeOf(DrawingsLayer.layerOptions.objectClass).toEqualTypeOf<Drawing.ImplementationClass>();
expectTypeOf(DrawingsLayer.DEFAULT_CONFIG_SETTING).toEqualTypeOf<"defaultDrawingConfig">();

const layer = new DrawingsLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Drawing.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<DrawingsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"drawings">();

expectTypeOf(layer.graphics).toEqualTypeOf<Collection<Drawing.Implementation>>();
expectTypeOf(layer.hud).toEqualTypeOf<DrawingHUD>();
expectTypeOf(layer.hookName).toEqualTypeOf<"DrawingsLayer">();

declare const somePoint: PIXI.IPointData;
expectTypeOf(layer.getSnappedPoint(somePoint)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(layer.configureDefault()).toEqualTypeOf<void>();

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer._getNewDrawingData(somePoint)).toEqualTypeOf<DrawingDocument.CreateData>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();

// deprecated since v12 until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.gridPrecision).toEqualTypeOf<16 | 8 | 0>();

Hooks.on("pasteDrawing", (objects, data, options) => {
  expectTypeOf(objects).toEqualTypeOf<Drawing.Implementation[]>();
  expectTypeOf(data).toEqualTypeOf<DrawingDocument.Source>();
  expectTypeOf(options).toEqualTypeOf<Hooks.PastePlaceableObjectOptions>();
});
