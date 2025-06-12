import { expectTypeOf } from "vitest";
import type { LineIntersection } from "../../../../../../src/foundry/common/utils/geometry.d.mts";
import { Ray } from "#client/canvas/geometry/_module.mjs";

let myRay = Ray.towardsPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 5);
myRay = Ray.fromAngle(50, 50, Math.PI / 2, 200);
myRay = Ray.fromArrays([50, 50], [100, 100]);

expectTypeOf(myRay.project(7)).toEqualTypeOf<PIXI.IPointData>();
expectTypeOf(myRay.reverse()).toEqualTypeOf<Ray>();
expectTypeOf(myRay.shiftAngle(20, 2000)).toEqualTypeOf<Ray>();
expectTypeOf(myRay.intersectSegment([30, 40, 90, 100])).toEqualTypeOf<LineIntersection | null>();
