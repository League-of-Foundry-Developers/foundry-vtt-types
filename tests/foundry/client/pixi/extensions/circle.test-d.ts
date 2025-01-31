import { expectTypeOf } from "vitest";

const circle = new PIXI.Circle();

expectTypeOf(circle.center).toEqualTypeOf<PIXI.Point>();
