import { expectTypeOf } from "vitest";
import { TilesLayer } from "#client/canvas/layers/_module.mjs";
import type { Tile } from "#client/canvas/placeables/_module.d.mts";

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
expectTypeOf(layer.controllableObjects()).toEqualTypeOf<Generator<Tile.Implementation, void, undefined>>();
expectTypeOf(layer.getSnappedPoint({ x: 2, y: 3 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

declare const someEvent: PIXI.FederatedEvent;
declare const somePointerEvent: PointerEvent;
declare const someDragEvent: DragEvent;
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](somePointerEvent)).toBeVoid();

expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    type: "Tile",
    fromFilePicker: true,
    tileSize: 100,
    texture: { src: "path/to/image.webp" },
    elevation: 0,
    width: 200,
    height: 200,
    x: 500,
    y: 500,
    sort: 1,
    occlusion: { mode: CONST.OCCLUSION_MODES.NONE },
  }),
).toEqualTypeOf<Promise<TileDocument.Implementation | false | void>>();
