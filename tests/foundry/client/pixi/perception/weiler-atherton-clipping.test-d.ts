import { expectTypeOf } from "vitest";

const myPolygon = new PIXI.Polygon([0, 0]);

const myCircle = new PIXI.Circle(2, 3, 4);

const myWeiler = new WeilerAthertonClipper(myPolygon, myCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
  density: 3,
  includeEndpoints: true,
});

expectTypeOf(myWeiler.clipObject).toEqualTypeOf<PIXI.Rectangle | PIXI.Circle>();
