import { expectTypeOf } from "vitest";

const pointA = new PIXI.Point(0, 0);
const pointB = new PIXI.Point(0, 0);

expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "any" })).toEqualTypeOf<boolean>();
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "closest" })).toEqualTypeOf<PolygonVertex>();
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "all" })).toEqualTypeOf<
  PolygonVertex[] | null
>();

expectTypeOf(ClockwiseSweepPolygon.create({ x: 0, y: 0 })).toEqualTypeOf<ClockwiseSweepPolygon>();
