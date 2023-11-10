import { expectTypeOf } from "vitest";

const someRay = new Ray({ x: 0, y: 0 }, { x: 0, y: 0 });
const somePolygonRay: PolygonRay = someRay as PolygonRay;
somePolygonRay.result = new CollisionResult();

expectTypeOf(ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: "any" })).toEqualTypeOf<boolean>();
expectTypeOf(
  ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: "closest" }),
).toEqualTypeOf<PolygonVertex>();
expectTypeOf(ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: "all" })).toEqualTypeOf<PolygonVertex[]>();

declare const initializedConfig: ClockwiseSweepPolygon.InitializedConfig;
expectTypeOf(initializedConfig.hasLimitedRadius).toEqualTypeOf<boolean>();
expectTypeOf(initializedConfig.radius).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.radius2).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.radiusE).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.aMin).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.aMax).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.angle).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.rotation).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.hasLimitedAngle).toEqualTypeOf<boolean>();
expectTypeOf(initializedConfig.density).toEqualTypeOf<number>();
expectTypeOf(initializedConfig.rMax).toEqualTypeOf<PolygonRay | undefined>();
expectTypeOf(initializedConfig.rMin).toEqualTypeOf<PolygonRay>();
declare const limitedAngleConfig: ClockwiseSweepPolygon.LimitedAngleConfig;
expectTypeOf(limitedAngleConfig.hasLimitedRadius).toEqualTypeOf<boolean>();
expectTypeOf(limitedAngleConfig.radius).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.radius2).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.radiusE).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.aMin).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.aMax).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.angle).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.rotation).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.hasLimitedAngle).toEqualTypeOf<true>();
expectTypeOf(limitedAngleConfig.density).toEqualTypeOf<number>();
expectTypeOf(limitedAngleConfig.rMax).toEqualTypeOf<PolygonRay>();
expectTypeOf(limitedAngleConfig.rMin).toEqualTypeOf<PolygonRay>();
