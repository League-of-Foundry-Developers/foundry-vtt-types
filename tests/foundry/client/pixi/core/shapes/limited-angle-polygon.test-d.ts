import { expectTypeOf } from "vitest";

const myPoint = new PIXI.Point(2, 2);
declare const someRay: Ray;

expectTypeOf(LimitedAnglePolygon.pointBetweenRays(myPoint, someRay, someRay, 30)).toEqualTypeOf<boolean>();

const myLimitedAnglePolygon = new LimitedAnglePolygon(myPoint, {
  radius: 1,
  angle: 90,
  rotation: 45,
  density: 2,
  externalRadius: 180,
});

expectTypeOf(myLimitedAnglePolygon.getBounds()).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myLimitedAnglePolygon._includeEdge({ x: 50, y: 50 }, { x: 100, y: 100 })).toEqualTypeOf<boolean>();
