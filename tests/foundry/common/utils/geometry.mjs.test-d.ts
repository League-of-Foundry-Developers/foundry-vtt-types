import { expectTypeOf } from "vitest";

// Global export test
expectTypeOf(orient2dFast).toEqualTypeOf(foundry.utils.orient2dFast);
expectTypeOf(lineSegmentIntersects).toEqualTypeOf(lineSegmentIntersects);
expectTypeOf(lineLineIntersection).toEqualTypeOf(foundry.utils.lineLineIntersection);
expectTypeOf(lineSegmentIntersects).toEqualTypeOf(foundry.utils.lineSegmentIntersects);
// ---

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

// utils.polygonCentroid

const points = [
  new PIXI.Point(0, 0),
  new PIXI.Point(1, 0),
  new PIXI.Point(1, 2),
  new PIXI.Point(0, 3),
] satisfies Point[];

const returnPoint = new PIXI.Point(0, 0);

expectTypeOf(foundry.utils.polygonCentroid(points)).toMatchTypeOf<Point>(returnPoint);

// utils.pathCircleIntersects

type CircleIntersectTest = {
  points: Parameters<typeof foundry.utils.pathCircleIntersects>[0];
  close: Parameters<typeof foundry.utils.pathCircleIntersects>[1];
  center: Parameters<typeof foundry.utils.pathCircleIntersects>[2];
  radius: Parameters<typeof foundry.utils.pathCircleIntersects>[3];
  result: ReturnType<typeof foundry.utils.pathCircleIntersects>;
};

// Testing for intersecting circle so that it actually returns what we expect
const testIntersectingCircle: CircleIntersectTest = {
  points: points,
  close: true,
  center: new PIXI.Point(0.5, 0.5),
  radius: 1,
  result: true,
};

expectTypeOf(
  foundry.utils.pathCircleIntersects(
    testIntersectingCircle.points,
    testIntersectingCircle.close,
    testIntersectingCircle.center,
    testIntersectingCircle.radius,
  ),
).toEqualTypeOf(testIntersectingCircle.result);

// utils.circleCircleIntersects

expectTypeOf(foundry.utils.circleCircleIntersects).parameter(0).toBeNumber();
expectTypeOf(foundry.utils.circleCircleIntersects).parameter(1).toBeNumber();
expectTypeOf(foundry.utils.circleCircleIntersects).parameter(2).toBeNumber();
expectTypeOf(foundry.utils.circleCircleIntersects).parameter(3).toBeNumber();
expectTypeOf(foundry.utils.circleCircleIntersects).parameter(4).toBeNumber();
expectTypeOf(foundry.utils.circleCircleIntersects).parameter(5).toBeNumber();

expectTypeOf(foundry.utils.circleCircleIntersects(0, 0, 1, 0, 0, 1)).toEqualTypeOf<boolean>();
