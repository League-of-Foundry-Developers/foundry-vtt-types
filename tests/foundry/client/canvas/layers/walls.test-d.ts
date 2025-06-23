import { expectTypeOf } from "vitest";
import type { Document } from "#common/abstract/_module.d.mts";
import { WallsLayer } from "#client/canvas/layers/_module.mjs";
import type { Wall } from "#client/canvas/placeables/_module.d.mts";

import Canvas = foundry.canvas.Canvas;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import Ray = foundry.canvas.geometry.Ray;

expectTypeOf(WallsLayer.documentName).toEqualTypeOf<"Wall">();
expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer | undefined>();
expectTypeOf(WallsLayer.layerOptions).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(WallsLayer.layerOptions.name).toEqualTypeOf<"walls">();
expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<Wall.ImplementationClass>();
declare const somePoint: PIXI.Point;
declare const someWall: Wall.Implementation;
expectTypeOf(WallsLayer.getClosestEndpoint(somePoint, someWall)).toEqualTypeOf<Canvas.PointTuple>();

const layer = new WallsLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Wall.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

expectTypeOf(layer.hookName).toEqualTypeOf<"WallsLayer">();
expectTypeOf(layer.doors).toEqualTypeOf<Wall.Implementation[]>();

expectTypeOf(layer.getSnappedPoint({ x: 71, y: 59 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

expectTypeOf(layer.releaseAll()).toBeNumber();

expectTypeOf(layer["_pasteObject"](someWall, somePoint)).toEqualTypeOf<Omit<WallDocument.Source, "_id">>();
expectTypeOf(layer["_pasteObject"](someWall, somePoint, { hidden: true, snap: false })).toEqualTypeOf<
  Omit<WallDocument.Source, "_id">
>();
expectTypeOf(layer["_pasteObject"](someWall, somePoint, { hidden: null, snap: undefined })).toEqualTypeOf<
  Omit<WallDocument.Source, "_id">
>();

declare const _x: Document.ConfiguredSourceForName<"Wall">;

expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint)).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: true })).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: null })).toEqualTypeOf<Canvas.PointTuple>();

expectTypeOf(layer["_getWallDataFromActiveTool"]()).toEqualTypeOf<WallDocument.Source>();
expectTypeOf(layer["_getWallDataFromActiveTool"]("ethereal")).toEqualTypeOf<WallDocument.Source>();
// @ts-expect-error foobar is not a handled Wall tool
expectTypeOf(layer["_getWallDataFromActiveTool"]("foobar")).toEqualTypeOf<Document.ConfiguredSourceForName<"Wall">>();

expectTypeOf(layer.identifyInteriorArea([someWall, someWall])).toEqualTypeOf<PIXI.Polygon[]>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toEqualTypeOf<Promise<Wall.Implementation>>();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();

declare const someRay: Ray;

// deprecated since v11 until v13
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.checkCollision(someRay, { type: "move" })).toEqualTypeOf<PointSourcePolygon.TestCollision<"all">>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.checkCollision(someRay, { type: "sight", mode: "any" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"any">
>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.checkCollision(someRay, { type: "light", mode: "closest" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"closest">
>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.checkCollision(someRay, { type: "sound", mode: "all" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"all">
>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.highlightControlledSegments()).toBeVoid();

// deprecated since v12 until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.initialize()).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.identifyInteriorWalls()).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.identifyWallIntersections()).toBeVoid();
