import { expectType } from "tsd";

expectType<GridLayer | undefined>(GridLayer.instance);
expectType<GridLayer.LayerOptions>(GridLayer.layerOptions);
expectType<"grid">(GridLayer.layerOptions.name);

const layer = new GridLayer();
expectType<"grid">(layer.options.name);
expectType<BaseGrid | undefined>(layer.grid);
expectType<PIXI.Container | undefined>(layer.highlight);
expectType<Record<string, GridHighlight>>(layer.highlightLayers);
expectType<foundry.CONST.GRID_TYPES>(layer.type);
expectType<number>(layer.size);
expectType<number>(layer.w);
expectType<number>(layer.h);
expectType<boolean>(layer.isHex);
expectType<Promise<GridLayer>>(layer.draw());
expectType<Promise<GridLayer>>(layer.draw({}));
expectType<Promise<GridLayer>>(layer.draw({ type: null, dimensions: null, gridColor: null, gridAlpha: null }));
expectType<Promise<GridLayer>>(layer.draw({ type: foundry.CONST.GRID_TYPES.GRIDLESS }));
expectType<Promise<GridLayer>>(layer.draw({ dimensions: (canvas as Canvas).dimensions }));
expectType<Promise<GridLayer>>(layer.draw({ gridColor: "#000000" }));
expectType<Promise<GridLayer>>(layer.draw({ gridColor: 0x000000 }));
expectType<Promise<GridLayer>>(layer.draw({ gridAlpha: 0.2 }));
expectType<{ x: number; y: number }>(layer.getSnappedPosition(10, 100));
expectType<{ x: number; y: number }>(layer.getSnappedPosition(10, 100, 2));
expectType<[number, number]>(layer.getTopLeft(8, 17));
expectType<[number, number]>(layer.getCenter(8, 17));
expectType<number>(layer.measureDistance({ x: 8, y: 17 }, { x: 1100, y: 1200 }));
expectType<number[]>(layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }]));
expectType<number[]>(layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }], {}));
expectType<number[]>(
  layer.measureDistances([{ ray: new Ray({ x: 8, y: 17 }, { x: 1100, y: 1200 }) }], { gridSpaces: true }),
);
expectType<GridHighlight>(layer.addHighlightLayer("some"));
expectType<GridHighlight | undefined>(layer.getHighlightLayer("some"));
expectType<void>(layer.clearHighlightLayer("some"));
expectType<void>(layer.destroyHighlightLayer("some"));
expectType<void | false>(layer.highlightPosition("some"));
expectType<void | false>(
  layer.highlightPosition("some", {
    x: 10,
    y: 100,
    color: 0x33bbff,
    border: null,
    alpha: 0.25,
    shape: new PIXI.Polygon(),
  }),
);
expectType<boolean>(layer.isNeighbor(0, 1, 2, 3));
