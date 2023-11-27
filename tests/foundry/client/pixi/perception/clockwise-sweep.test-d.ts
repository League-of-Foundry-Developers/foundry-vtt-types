import { Point } from "pixi.js";
import { expectTypeOf } from "vitest";

const pointA = new Point(0, 0);
const pointB = new Point(0, 0);

expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "any" })).toEqualTypeOf<boolean>();
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "closest" })).toEqualTypeOf<PolygonVertex>();
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "all" })).toEqualTypeOf<PolygonVertex[]>();
