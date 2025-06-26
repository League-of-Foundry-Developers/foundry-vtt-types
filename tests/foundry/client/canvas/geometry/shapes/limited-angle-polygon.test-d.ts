import { expectTypeOf } from "vitest";

import LimitedAnglePolygon = foundry.canvas.geometry.LimitedAnglePolygon;
import Ray = foundry.canvas.geometry.Ray;

const myPoint = new PIXI.Point(2, 2);
declare const someRay: Ray;

expectTypeOf(LimitedAnglePolygon.pointBetweenRays(myPoint, someRay, someRay, 30)).toEqualTypeOf<boolean>();

// @ts-expect-error must pass a `radius` in options or you get NaNs
new LimitedAnglePolygon(myPoint);
new LimitedAnglePolygon(myPoint, {
  radius: 5,
  angle: undefined,
  density: undefined,
  externalRadius: undefined,
  rotation: undefined,
});
const myLimitedAnglePolygon = new LimitedAnglePolygon(myPoint, {
  radius: 200,
  angle: 90,
  rotation: 45,
  density: 2,
  externalRadius: 280,
});

expectTypeOf(myLimitedAnglePolygon.getBounds()).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myLimitedAnglePolygon["_includeEdge"]({ x: 50, y: 50 }, { x: 100, y: 100 })).toEqualTypeOf<boolean>();
