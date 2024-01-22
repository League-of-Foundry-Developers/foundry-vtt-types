import { expectTypeOf } from "vitest";

const myPoint = new PIXI.Point(2, 2);

const myLimitedAnglePolygon = new LimitedAnglePolygon(myPoint, {
  radius: 1,
});

expectTypeOf(myLimitedAnglePolygon.getBounds()).toEqualTypeOf<PIXI.Rectangle>();
