import { expectTypeOf, test } from "vitest";

import RegionLayer = foundry.canvas.layers.RegionLayer;
import Canvas = foundry.canvas.Canvas;
import Region = foundry.canvas.placeables.Region;
import RegionPalette = foundry.applications.sheets.palette.RegionPalette;

declare const someShapeData: foundry.data.BaseShapeData;

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: foundry.canvas.Canvas.Event.Wheel;
declare const keyboardEvent: KeyboardEvent;

declare const regionData: RegionDocument.CreateData;

test("foundry/client/canvas/layers/regions", () => {
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

  expectTypeOf(layer["_deactivate"]()).toBeVoid();
  expectTypeOf(layer.templateMode).toBeBoolean();
  expectTypeOf(layer._togglePaletteVisible).toBeBoolean();
  expectTypeOf(layer._highlights).toEqualTypeOf<PIXI.Container>();
  expectTypeOf(layer._shapeClipboard).toEqualTypeOf<RegionLayer.ShapeClipboard>();
  expectTypeOf(layer._placementContext).toEqualTypeOf<RegionLayer.PlacementContext | null>();
  expectTypeOf(RegionLayer.paletteClass).toEqualTypeOf<typeof RegionPalette>();

  // `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
  // The override does not change the signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

  expectTypeOf(layer.copyObjects()).toEqualTypeOf<Region.Implementation[]>();
  expectTypeOf(layer.getSnappedPoint({ x: 10, y: 20 })).toEqualTypeOf<Canvas.Point>();
  expectTypeOf(layer.getZIndex()).toBeNumber();

  expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
  expectTypeOf(layer._highlightShape()).toBeVoid();
  expectTypeOf(layer._highlightShape(null)).toBeVoid();
  expectTypeOf(layer._highlightShape(someShapeData)).toBeVoid();
  expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
  expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
  expectTypeOf(layer["_createDragPreviewData"](pointerEvent)).toEqualTypeOf<RegionDocument.CreateData>();
  expectTypeOf(layer["_updateDragPreview"](pointerEvent)).toBeVoid();
  expectTypeOf(layer["_onDeleteKey"](keyboardEvent)).toBeBoolean();
  expectTypeOf(layer["_onCutKey"](keyboardEvent)).toBeBoolean();
  expectTypeOf(layer["_onCopyKey"](keyboardEvent)).toBeBoolean();
  expectTypeOf(layer["_onPasteKey"](keyboardEvent)).toBeBoolean();
  expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toBeVoid();
  expectTypeOf(layer["_onDismissKey"](keyboardEvent)).toBeBoolean();
  expectTypeOf(layer._cancelPlacement()).toBeVoid();
  expectTypeOf(layer.placeRegion(regionData)).toEqualTypeOf<Promise<RegionDocument.Implementation | null>>();
  expectTypeOf(layer.placeRegion(regionData, { create: false, allowRotation: true })).toEqualTypeOf<
    Promise<RegionDocument.Implementation | null>
  >();
  expectTypeOf(layer.placeRegions([regionData], { attachToToken: true })).toEqualTypeOf<
    Promise<RegionDocument.Implementation[] | null>
  >();
});
