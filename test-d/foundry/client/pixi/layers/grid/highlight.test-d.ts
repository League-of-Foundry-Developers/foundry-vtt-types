import { expectType } from "tsd";

expectType<GridHighlight>(new GridHighlight(""));

const grid = new GridHighlight("", new PIXI.GraphicsGeometry());
expectType<string>(grid.name);
expectType<Set<string>>(grid.positions);
expectType<boolean>(grid.highlight(100, 100));
expectType<GridHighlight>(grid.clear());
expectType<void>(grid.destroy());
expectType<void>(grid.destroy({ children: true, texture: true, baseTexture: true }));
