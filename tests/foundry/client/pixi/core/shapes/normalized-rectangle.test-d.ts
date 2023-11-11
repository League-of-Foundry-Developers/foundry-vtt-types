import { assertType, expectTypeOf } from "vitest";

const rectangle = new NormalizedRectangle(100, 300, 500, 400);
assertType<PIXI.Rectangle>(rectangle);
expectTypeOf(rectangle.rotate(0.5)).toEqualTypeOf<NormalizedRectangle>();

expectTypeOf(NormalizedRectangle.fromRotation(100, 300, 200, 100, 0.5)).toEqualTypeOf<NormalizedRectangle>();
