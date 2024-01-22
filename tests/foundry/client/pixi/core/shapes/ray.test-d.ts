import { expectTypeOf } from "vitest";

const myRay = Ray.towardsPoint({ x: 0, y: 0 }, { x: 1, y: 1 }, 5);

expectTypeOf(myRay.project(7)).toEqualTypeOf<{ x: number; y: number }>();
