import { expectTypeOf } from "vitest";

const a = { x: 0, y: 0 };
const b = new PIXI.Point(0, 0);
const c = { x: 0, y: 0 };
const d = new PIXI.Point(0, 0);

const o = new PIXI.Circle(0, 0, 0);
const r = new Ray(a, b);

expectTypeOf(foundry.utils.orient2dFast(a, b, c)).toEqualTypeOf<number>();

expectTypeOf(foundry.utils.lineSegmentIntersects(a, b, c, d)).toEqualTypeOf<boolean>();

expectTypeOf(foundry.utils.lineLineIntersection(a, b, c, d)).toEqualTypeOf<foundry.utils.LineIntersection | null>();
expectTypeOf(
  foundry.utils.lineLineIntersection(a, b, c, d, { t1: true }),
).toEqualTypeOf<foundry.utils.LineIntersection | null>();
expectTypeOf(foundry.utils.lineLineIntersection(a, b, c, d, { t1: true })).toEqualTypeOf(
  r.intersectSegment([0, 0, 0, 0]),
);

expectTypeOf(foundry.utils.lineSegmentIntersects(a, b, c, d)).toEqualTypeOf<boolean>();

expectTypeOf(foundry.utils.lineCircleIntersection(a, b, c, 0).intersections).toEqualTypeOf(
  o.segmentIntersections(a, b),
);
expectTypeOf(foundry.utils.lineCircleIntersection(a, b, c, 0).intersections).toEqualTypeOf(
  foundry.utils.quadraticIntersection(a, b, c, 0),
);
