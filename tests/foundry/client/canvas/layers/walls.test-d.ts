import { describe, expectTypeOf, test } from "vitest";

import WallsLayer = foundry.canvas.layers.WallsLayer;
import PlaceablesLayer = foundry.canvas.layers.PlaceablesLayer;
import Wall = foundry.canvas.placeables.Wall;
import Canvas = foundry.canvas.Canvas;

declare const pixiPoint: PIXI.Point;
declare const wall: Wall.Implementation;
declare const pointerEvent: Canvas.Event.Pointer;
declare const creationHistoryEntry: PlaceablesLayer.CreationHistoryEntry<"Wall">;

describe("WallsLayer Tests", () => {
  test("Construction", () => {
    new WallsLayer();
  });

  const layer = new WallsLayer();

  test("Miscellaneous", () => {
    expectTypeOf(layer.chain).toEqualTypeOf<PIXI.Graphics | null>();
    expectTypeOf(layer._chain).toBeBoolean();
    expectTypeOf(layer._cloneType).toEqualTypeOf<WallDocument.Source | null>();
    expectTypeOf(layer._last).toEqualTypeOf<WallsLayer.LastPoint>();

    expectTypeOf(layer.doors).toEqualTypeOf<Wall.Implementation[]>();

    expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(layer["_deactivate"]()).toBeVoid();

    expectTypeOf(layer.releaseAll()).toBeNumber();
  });

  test("Necessary type overrides", () => {
    expectTypeOf(WallsLayer.documentName).toEqualTypeOf<"Wall">();
    expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer.Implementation | undefined>();

    expectTypeOf(WallsLayer.layerOptions).toEqualTypeOf<WallsLayer.LayerOptions>();
    expectTypeOf(WallsLayer.layerOptions.name).toEqualTypeOf<"walls">();
    expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<Wall.ImplementationClass>();

    expectTypeOf(layer.options.objectClass).toEqualTypeOf<Wall.ImplementationClass>();
    expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
    expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

    expectTypeOf(layer.hookName).toEqualTypeOf<"WallsLayer">();
  });

  test("Coordinates", () => {
    expectTypeOf(WallsLayer.getClosestEndpoint(pixiPoint, wall)).toEqualTypeOf<Canvas.PointTuple>();

    expectTypeOf(layer.getSnappedPoint({ x: 71, y: 59 })).toEqualTypeOf<Canvas.Point>();

    expectTypeOf(layer._getWallEndpointCoordinates(pixiPoint)).toEqualTypeOf<Canvas.PointTuple>();
    expectTypeOf(layer._getWallEndpointCoordinates(pixiPoint, { snap: true })).toEqualTypeOf<Canvas.PointTuple>();
    expectTypeOf(layer._getWallEndpointCoordinates(pixiPoint, { snap: undefined })).toEqualTypeOf<Canvas.PointTuple>();

    expectTypeOf(layer.identifyInteriorArea([wall, wall])).toEqualTypeOf<PIXI.Polygon[]>();
  });

  test("Event handlers", () => {
    expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toEqualTypeOf<Promise<Wall.Implementation>>();
    expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
    expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
    expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();

    expectTypeOf(layer["_onUndoCreate"](creationHistoryEntry)).toEqualTypeOf<Promise<WallDocument.Implementation[]>>();

    expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();
  });

  test("Deprecated", () => {
    // Deprecated since v12 until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.initialize()).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.identifyInteriorWalls()).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(layer.identifyWallIntersections()).toBeVoid();
  });
});
