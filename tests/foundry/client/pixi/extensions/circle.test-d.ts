import { expectTypeOf } from "vitest";

const circle = new PIXI.Circle();

expectTypeOf(circle.circle).toEqualTypeOf<PIXI.Point>();
