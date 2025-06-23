import { expectTypeOf } from "vitest";
import { RegionLayer } from "#client/canvas/layers/_module.mjs";

import Canvas = foundry.canvas.Canvas;
import Region = foundry.canvas.placeables.Region;

expectTypeOf(RegionLayer.documentName).toEqualTypeOf<"Region">();
expectTypeOf(RegionLayer.instance).toEqualTypeOf<RegionLayer | undefined>();
expectTypeOf(RegionLayer.layerOptions).toEqualTypeOf<RegionLayer.LayerOptions>();
expectTypeOf(RegionLayer.layerOptions.name).toEqualTypeOf<"regions">();
expectTypeOf(RegionLayer.layerOptions.objectClass).toEqualTypeOf<Region.ImplementationClass>();

const layer = new RegionLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Region.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<RegionLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"regions">();

expectTypeOf(layer.hookName).toEqualTypeOf<"RegionLayer">();
expectTypeOf(layer.legend).toEqualTypeOf<foundry.applications.ui.RegionLegend>();
expectTypeOf(layer._holeMode).toBeBoolean();

expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

// `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
// The override does not change the signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

expectTypeOf(layer.copyObjects()).toEqualTypeOf<[]>();
expectTypeOf(layer.getSnappedPoint({ x: 10, y: 20 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(layer.getZIndex()).toBeNumber();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

declare const someShapeData: foundry.data.BaseShapeData;
expectTypeOf(layer["_highlightShape"]()).toBeVoid();
expectTypeOf(layer["_highlightShape"](null)).toBeVoid();
expectTypeOf(
  layer["_highlightShape"]({
    type: "rectangle",
    hole: true,
  }),
).toBeVoid();
expectTypeOf(layer["_highlightShape"](someShapeData)).toBeVoid();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();
