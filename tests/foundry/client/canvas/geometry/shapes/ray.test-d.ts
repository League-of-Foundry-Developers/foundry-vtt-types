import { expectTypeOf } from "vitest";

import Ray = foundry.canvas.geometry.Ray;
import Canvas = foundry.canvas.Canvas;

type LineIntersection = foundry.utils.LineIntersection;

expectTypeOf(Ray.fromAngle(50, 50, Math.PI / 2, 200)).toEqualTypeOf<Ray>();
expectTypeOf(Ray.fromArrays([50, 50], [100, 100])).toEqualTypeOf<Ray>();
expectTypeOf(Ray.towardsPoint({ x: 0, y: 0 }, { x: 100, y: 100 }, 5)).toEqualTypeOf<Ray>();

const myRay = Ray.towardsPointSquared({ x: 0, y: 0 }, { x: 100, y: 100 }, 25);

expectTypeOf(myRay.project(7)).toEqualTypeOf<Exclude<Canvas.Point, PIXI.Point>>();
expectTypeOf(myRay.reverse()).toEqualTypeOf<Ray>();
expectTypeOf(myRay.shiftAngle(20, 2000)).toEqualTypeOf<Ray>();
expectTypeOf(myRay.intersectSegment([30, 40, 90, 100])).toEqualTypeOf<LineIntersection | null>();
