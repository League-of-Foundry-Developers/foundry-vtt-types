import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";
import TilePalette = foundry.applications.sheets.palette.TilePalette;

import TilesLayer = foundry.canvas.layers.TilesLayer;
import Tile = foundry.canvas.placeables.Tile;
import Canvas = foundry.canvas.Canvas;
import TileHUD = foundry.applications.hud.TileHUD;

expectTypeOf(TilesLayer.documentName).toEqualTypeOf<"Tile">();
expectTypeOf(TilesLayer.instance).toEqualTypeOf<TilesLayer | undefined>();
expectTypeOf(TilesLayer.layerOptions).toEqualTypeOf<TilesLayer.LayerOptions>();
expectTypeOf(TilesLayer.layerOptions.name).toEqualTypeOf<"tiles">();
expectTypeOf(TilesLayer.layerOptions.objectClass).toEqualTypeOf<Tile.ImplementationClass>();

const layer = new TilesLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Tile.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<TilesLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tiles">();

expectTypeOf(layer.hookName).toEqualTypeOf<"TilesLayer">();
expectTypeOf(layer.hud).toEqualTypeOf<TileHUD>();
expectTypeOf(layer.tiles).toEqualTypeOf<Tile.Implementation[]>();
expectTypeOf(layer.getSnappedPoint({ x: 2, y: 3 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(TilesLayer.paletteClass).toEqualTypeOf<typeof TilePalette>();
expectTypeOf(TilesLayer.layerOptions.confirmBeforeCreation).toEqualTypeOf<true>();

expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someDragEvent: DragEvent;
expectTypeOf(layer["_createDragPreviewData"](pointerEvent)).toEqualTypeOf<TileDocument.CreateData>();
expectTypeOf(layer["_createDragShapeData"](pointerEvent)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(layer["_updateDragPreview"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_updateMouseWheelPreview"]()).toBeVoid();

expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    type: "Tile",
    fromFilePicker: true,
    tileSize: 100,
    texture: { src: "path/to/image.webp" },
    width: 200,
    height: 200,
    x: 500,
    y: 500,
    sort: 1,
  }),
).toEqualTypeOf<Promise<TileDocument.Implementation | false | void>>();
