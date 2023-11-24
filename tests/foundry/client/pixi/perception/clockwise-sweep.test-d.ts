import { Point } from "pixi.js";
import { expectTypeOf } from "vitest";

const pointA = new Point(0, 0);
const pointB = new Point(0, 0);
// Genuinely confused what's going on here
// without this I get 'Arguments for the rest parameter 'MISMATCH' were not provided.'; possible bug in vitest?
const testResult = {} as never;

expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "any" })).toEqualTypeOf<boolean>(testResult);
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "closest" })).toEqualTypeOf<PolygonVertex>(
  testResult,
);
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "all" })).toEqualTypeOf<PolygonVertex[]>(
  testResult,
);
