import { expectTypeOf } from "vitest";
import type Document from "../../../../../../src/foundry/common/abstract/document.d.mts";

expectTypeOf(WallsLayer.documentName).toEqualTypeOf<"Wall">();
expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer | undefined>();
expectTypeOf(WallsLayer.layerOptions).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(WallsLayer.layerOptions.name).toEqualTypeOf<"walls">();
expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<Wall.ObjectClass>();
declare const somePoint: PIXI.Point;
declare const someWall: Wall.Object;
expectTypeOf(WallsLayer.getClosestEndpoint(somePoint, someWall)).toEqualTypeOf<Canvas.PointTuple>();

const layer = new WallsLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Wall.ObjectClass>();
expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

expectTypeOf(layer.hookName).toEqualTypeOf<"WallsLayer">();
expectTypeOf(layer.doors).toEqualTypeOf<Wall.Object[]>();

expectTypeOf(layer.getSnappedPoint({ x: 71, y: 59 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

expectTypeOf(layer.releaseAll()).toBeNumber();

expectTypeOf(layer["_pasteObject"](someWall, somePoint)).toEqualTypeOf<Document.ConfiguredSourceForName<"Wall">>();
expectTypeOf(layer["_pasteObject"](someWall, somePoint, { hidden: true, snap: false })).toEqualTypeOf<
  Document.ConfiguredSourceForName<"Wall">
>();
expectTypeOf(layer["_pasteObject"](someWall, somePoint, { hidden: null, snap: undefined })).toEqualTypeOf<
  Document.ConfiguredSourceForName<"Wall">
>();

expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint)).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: true })).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: null })).toEqualTypeOf<Canvas.PointTuple>();

expectTypeOf(layer["_getWallDataFromActiveTool"]()).toEqualTypeOf<Document.ConfiguredSourceForName<"Wall">>();
expectTypeOf(layer["_getWallDataFromActiveTool"]("ethereal")).toEqualTypeOf<Document.ConfiguredSourceForName<"Wall">>();
// @ts-expect-error foobar is not a handled Wall tool
expectTypeOf(layer["_getWallDataFromActiveTool"]("foobar")).toEqualTypeOf<Document.ConfiguredSourceForName<"Wall">>();

expectTypeOf(layer.identifyInteriorArea([someWall, someWall])).toEqualTypeOf<PIXI.Polygon[]>();

declare const someEvent: PIXI.FederatedEvent;
declare const somePointerEvent: PointerEvent;
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toEqualTypeOf<Promise<Wall.Object>>();
expectTypeOf(layer["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](somePointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight"](someEvent)).toBeVoid();

declare const someRay: Ray;

// deprecated since v11 until v13
expectTypeOf(layer.checkCollision(someRay, { type: "move" })).toEqualTypeOf<PointSourcePolygon.TestCollision<"all">>();
expectTypeOf(layer.checkCollision(someRay, { type: "sight", mode: "any" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"any">
>();
expectTypeOf(layer.checkCollision(someRay, { type: "light", mode: "closest" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"closest">
>();
expectTypeOf(layer.checkCollision(someRay, { type: "sound", mode: "all" })).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"all">
>();

expectTypeOf(layer.highlightControlledSegments()).toBeVoid();

// deprecated since v12 until v14
expectTypeOf(layer.initialize()).toBeVoid();
expectTypeOf(layer.identifyInteriorWalls()).toBeVoid();
expectTypeOf(layer.identifyWallIntersections()).toBeVoid();
