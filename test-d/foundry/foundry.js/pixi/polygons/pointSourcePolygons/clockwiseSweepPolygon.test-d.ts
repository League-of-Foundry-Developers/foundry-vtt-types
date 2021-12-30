import { expectType } from 'tsd';

const someRay = new Ray({ x: 0, y: 0 }, { x: 0, y: 0 });
expectType<boolean>(ClockwiseSweepPolygon.getRayCollisions(someRay, { mode: 'any' }));
expectType<PolygonVertex>(ClockwiseSweepPolygon.getRayCollisions(someRay, { mode: 'closest' }));
expectType<PolygonVertex[]>(ClockwiseSweepPolygon.getRayCollisions(someRay, { mode: 'all' }));
