import { expectTypeOf } from "vitest";
import BaseGrid = foundry.documents.BaseGrid;

expectTypeOf(GridLayer.instance).toEqualTypeOf<GridLayer | undefined>();
expectTypeOf(GridLayer.layerOptions).toEqualTypeOf<GridLayer.LayerOptions>();
expectTypeOf(GridLayer.layerOptions.name).toEqualTypeOf<"grid">();

const layer = new GridLayer();
expectTypeOf(layer.options.name).toEqualTypeOf<"grid">();
expectTypeOf(layer.grid).toEqualTypeOf<BaseGrid | undefined>();
expectTypeOf(layer.highlight).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(layer.highlightLayers).toEqualTypeOf<Record<string, GridHighlight>>();
expectTypeOf(layer.type).toEqualTypeOf<foundry.CONST.GRID_TYPES>();
expectTypeOf(layer.size).toEqualTypeOf<number>();
expectTypeOf(layer.w).toEqualTypeOf<number>();
expectTypeOf(layer.h).toEqualTypeOf<number>();
expectTypeOf(layer.isHex).toEqualTypeOf<boolean>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({})).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({ type: null, dimensions: null, gridColor: null, gridAlpha: null })).toEqualTypeOf<
  Promise<GridLayer>
>();
expectTypeOf(layer.draw({ type: foundry.CONST.GRID_TYPES.GRIDLESS })).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({ dimensions: canvas!.dimensions })).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({ gridColor: "#000000" })).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({ gridColor: 0x000000 })).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.draw({ gridAlpha: 0.2 })).toEqualTypeOf<Promise<GridLayer>>();
expectTypeOf(layer.getSnappedPosition(10, 100)).toEqualTypeOf<{ x: number; y: number }>();
expectTypeOf(layer.getSnappedPosition(10, 100, 2)).toEqualTypeOf<{ x: number; y: number }>();
expectTypeOf(layer.getTopLeft(8, 17)).toEqualTypeOf<[number, number]>();
expectTypeOf(layer.getCenter(8, 17)).toEqualTypeOf<[number, number]>();
expectTypeOf(layer.measureDistance({ x: 8, y: 17 }, { x: 1100, y: 1200 })).toEqualTypeOf<number>();
expectTypeOf(layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }])).toEqualTypeOf<
  number[]
>();
expectTypeOf(layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }], {})).toEqualTypeOf<
  number[]
>();
expectTypeOf(
  layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }], { gridSpaces: true }),
).toEqualTypeOf<number[]>();
expectTypeOf(layer.addHighlightLayer("some")).toEqualTypeOf<GridHighlight>();
expectTypeOf(layer.getHighlightLayer("some")).toEqualTypeOf<GridHighlight | undefined>();
expectTypeOf(layer.clearHighlightLayer("some")).toEqualTypeOf<void>();
expectTypeOf(layer.destroyHighlightLayer("some")).toEqualTypeOf<void>();
expectTypeOf(layer.highlightPosition("some")).toEqualTypeOf<void | false>();
expectTypeOf(
  layer.highlightPosition("some", {
    x: 10,
    y: 100,
    color: 0x33bbff,
    border: null,
    alpha: 0.25,
    shape: new PIXI.Polygon(),
  }),
).toEqualTypeOf<void | false>();
expectTypeOf(layer.isNeighbor(0, 1, 2, 3)).toEqualTypeOf<boolean>();
