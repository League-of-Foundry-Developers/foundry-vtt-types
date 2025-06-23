import { expectTypeOf } from "vitest";
import fu = foundry.utils;

import Canvas = foundry.canvas.Canvas;

const a = { x: 0, y: 0 };
const b = new PIXI.Point(0, 0);
const c = { x: 0, y: 0 };
const d = new PIXI.Point(0, 0);

expectTypeOf(fu.orient2dFast(a, b, c)).toEqualTypeOf<number>();

expectTypeOf(fu.lineSegmentIntersects(a, b, c, d)).toEqualTypeOf<boolean>();

expectTypeOf(fu.lineLineIntersection(a, b, c, d)).toEqualTypeOf<fu.LineIntersection | null>();
expectTypeOf(fu.lineLineIntersection(a, b, c, d, { t1: true })).toEqualTypeOf<fu.LineIntersection | null>();
expectTypeOf(fu.lineLineIntersection(a, b, c, d, { t1: undefined })).toEqualTypeOf<fu.LineIntersection | null>();

expectTypeOf(fu.lineCircleIntersection(a, b, c, 0)).toEqualTypeOf<fu.LineCircleIntersection>();

expectTypeOf(fu.closestPointToSegment(a, b, c)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(fu.quadraticIntersection(a, b, c, 2, 2)).toEqualTypeOf<[Canvas.Point?, Canvas.Point?]>();

const points = [
  new PIXI.Point(0, 0),
  new PIXI.Point(1, 0),
  new PIXI.Point(1, 2),
  new PIXI.Point(0, 3),
] satisfies Canvas.Point[];

expectTypeOf(fu.polygonCentroid(points)).toExtend<Canvas.Point>();

expectTypeOf(fu.pathCircleIntersects(points, true, a, 1)).toEqualTypeOf<boolean>();

expectTypeOf(fu.circleCircleIntersects(1, 2, 3, 3, 2, 1)).toEqualTypeOf<boolean>();
