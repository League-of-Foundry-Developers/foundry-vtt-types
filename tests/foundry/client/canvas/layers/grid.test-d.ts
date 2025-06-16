import { expectTypeOf } from "vitest";

import BaseGrid = foundry.grid.BaseGrid;
import GridLayer = foundry.canvas.layers.GridLayer;
import GridMesh = foundry.canvas.containers.GridMesh;
import GridHighlight = foundry.canvas.containers.GridHighlight;

// This is deliberately typed incorrectly in v12; runtime would actually return a BaseGrid subtype
expectTypeOf(GridLayer.instance).toEqualTypeOf<GridLayer>();

expectTypeOf(GridLayer.layerOptions).toEqualTypeOf<GridLayer.LayerOptions>();
expectTypeOf(GridLayer.layerOptions.name).toEqualTypeOf<"grid">();

const layer = new GridLayer();

expectTypeOf(layer.mesh).toEqualTypeOf<GridMesh | undefined>();
expectTypeOf(layer.highlight).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(layer.highlightLayers).toEqualTypeOf<Record<string, GridHighlight>>();

expectTypeOf(layer.options.name).toEqualTypeOf<"grid">();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({})).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer["_drawMesh"]()).toEqualTypeOf<GridMesh>();
// @ts-expect-error `initializeMesh` lacks a default for its one parameter, despite all its properties being optional
expectTypeOf(layer.initializeMesh()).toBeVoid();
expectTypeOf(layer.initializeMesh({})).toBeVoid();
expectTypeOf(
  layer.initializeMesh({
    alpha: 0.8,
    color: Color.from(0xabcdef).valueOf(),
    style: "roundPoints",
    thickness: 3,
  }),
).toBeVoid();
expectTypeOf(
  layer.initializeMesh({
    alpha: undefined,
    color: undefined,
    style: null,
    thickness: undefined,
  }),
).toBeVoid();

expectTypeOf(layer.addHighlightLayer("some")).toEqualTypeOf<GridHighlight>();
expectTypeOf(layer.getHighlightLayer("some")).toEqualTypeOf<GridHighlight | undefined>();
expectTypeOf(layer.clearHighlightLayer("some")).toEqualTypeOf<void>();
expectTypeOf(layer.destroyHighlightLayer("some")).toEqualTypeOf<void>();

// @ts-expect-error `highlightPosition` requires `x` and `y` properties in its options
expectTypeOf(layer.highlightPosition("some", {}));
expectTypeOf(layer.highlightPosition("some", { x: 50, y: 50 })).toEqualTypeOf<void>();
expectTypeOf(
  layer.highlightPosition("some", {
    x: 10,
    y: 100,
    color: 0x33bbff,
    border: Color.from("#ABCFED"),
    alpha: 0.25,
    shape: new PIXI.Polygon(),
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  layer.highlightPosition("some", {
    x: 10,
    y: 100,
    color: null,
    border: undefined,
    alpha: undefined,
    shape: undefined, // will fail silently on gridless
  }),
).toEqualTypeOf<void>();

// deprecated since v12 until v14

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.type).toEqualTypeOf<foundry.CONST.GRID_TYPES>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.size).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.grid).toEqualTypeOf<BaseGrid | null>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.isNeighbor(0, 1, 2, 3)).toEqualTypeOf<boolean>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.w).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.h).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.isHex).toEqualTypeOf<boolean>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.getTopLeft(8, 17)).toEqualTypeOf<[number, number]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.getCenter(8, 17)).toEqualTypeOf<[number, number]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.getSnappedPosition(10, 100, 2)).toEqualTypeOf<{ x: number; y: number }>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.measureDistance({ x: 8, y: 17 }, { x: 1100, y: 1200 })).toEqualTypeOf<number>();
