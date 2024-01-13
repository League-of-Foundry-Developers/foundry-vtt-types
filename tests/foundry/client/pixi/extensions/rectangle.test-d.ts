import { assertType, expectTypeOf } from "vitest";

const rectangle = new PIXI.Rectangle();

assertType<Record<string, number>>(rectangle.CS_ZONES);
expectTypeOf(rectangle.center).toEqualTypeOf<Point>();
