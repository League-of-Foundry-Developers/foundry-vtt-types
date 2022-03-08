import { expectType } from 'tsd';

const someRay = new Ray({ x: 0, y: 0 }, { x: 0, y: 0 });
const somePolygonRay: PolygonRay = someRay as PolygonRay;
somePolygonRay.result = new CollisionResult();

expectType<boolean>(ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: 'any' }));
expectType<PolygonVertex>(ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: 'closest' }));
expectType<PolygonVertex[]>(ClockwiseSweepPolygon.getRayCollisions(somePolygonRay, { mode: 'all' }));

declare const initializedConfig: ClockwiseSweepPolygon.InitializedConfig;
expectType<boolean>(initializedConfig.hasLimitedRadius);
expectType<number>(initializedConfig.radius);
expectType<number>(initializedConfig.radius2);
expectType<number>(initializedConfig.radiusE);
expectType<number>(initializedConfig.aMin);
expectType<number>(initializedConfig.aMax);
expectType<number>(initializedConfig.angle);
expectType<number>(initializedConfig.rotation);
expectType<boolean>(initializedConfig.hasLimitedAngle);
expectType<number>(initializedConfig.density);
expectType<PolygonRay | undefined>(initializedConfig.rMax);
expectType<PolygonRay>(initializedConfig.rMin);
declare const limitedAngleConfig: ClockwiseSweepPolygon.LimitedAngleConfig;
expectType<boolean>(limitedAngleConfig.hasLimitedRadius);
expectType<number>(limitedAngleConfig.radius);
expectType<number>(limitedAngleConfig.radius2);
expectType<number>(limitedAngleConfig.radiusE);
expectType<number>(limitedAngleConfig.aMin);
expectType<number>(limitedAngleConfig.aMax);
expectType<number>(limitedAngleConfig.angle);
expectType<number>(limitedAngleConfig.rotation);
expectType<true>(limitedAngleConfig.hasLimitedAngle);
expectType<number>(limitedAngleConfig.density);
expectType<PolygonRay>(limitedAngleConfig.rMax);
expectType<PolygonRay>(limitedAngleConfig.rMin);
