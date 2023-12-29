import { expectTypeOf } from "vitest";

const myPoly = new PIXI.Polygon([0, 1, 2, 3]);

expectTypeOf(myPoly.isPositive).toBeBoolean();
