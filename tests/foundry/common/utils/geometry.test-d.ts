import { expectTypeOf } from "vitest";

const a = { x: 0, y: 0 };
const b = new PIXI.Point(0, 0);
const c = { x: 0, y: 0 };
const d = new PIXI.Point(0, 0);

expectTypeOf(foundry.utils.orient2dFast(a, b, c)).toEqualTypeOf<number>();

expectTypeOf(foundry.utils.lineSegmentIntersects(a, b, c, d)).toEqualTypeOf<boolean>();

expectTypeOf(foundry.utils.lineLineIntersection(a, b, c, d)).toEqualTypeOf<foundry.utils.LineIntersection | null>();
expectTypeOf(
  foundry.utils.lineLineIntersection(a, b, c, d, { t1: true }),
).toEqualTypeOf<foundry.utils.LineIntersection | null>();
expectTypeOf(
  foundry.utils.lineLineIntersection(a, b, c, d, { t1: true }),
).toEqualTypeOf<foundry.utils.LineIntersection | null>();

expectTypeOf(foundry.utils.lineCircleIntersection(a, b, c, 0)).toEqualTypeOf<foundry.utils.LineCircleIntersection>();

expectTypeOf(foundry.utils.closestPointToSegment(a, b, c)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(foundry.utils.quadraticIntersection(a, b, c, 2, 2)).toEqualTypeOf<[Canvas.Point?, Canvas.Point?]>();

const points = [
  new PIXI.Point(0, 0),
  new PIXI.Point(1, 0),
  new PIXI.Point(1, 2),
  new PIXI.Point(0, 3),
] satisfies Canvas.Point[];

expectTypeOf(foundry.utils.polygonCentroid(points)).toMatchTypeOf<Canvas.Point>();

expectTypeOf(foundry.utils.pathCircleIntersects(points, true, a, 1)).toEqualTypeOf<boolean>();

expectTypeOf(foundry.utils.circleCircleIntersects(1, 2, 3, 3, 2, 1)).toEqualTypeOf<boolean>();
