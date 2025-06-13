import { expectTypeOf } from "vitest";

expectTypeOf(PIXI.Circle.approximateVertexDensity(128)).toEqualTypeOf<number>();

declare const somePoint: PIXI.Point;
declare const somePoly: PIXI.Polygon;
const circle = new PIXI.Circle();
const clipperPoints = [
  { X: 50, Y: 50 },
  { X: 50, Y: 100 },
  { X: 100, Y: 100 },
  { X: 100, Y: 50 },
];

expectTypeOf(circle.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(circle.pointIsOn(somePoint)).toEqualTypeOf<boolean>();
expectTypeOf(circle.segmentIntersections(somePoint, { x: 50, y: 50 })).toEqualTypeOf<[Canvas.Point?, Canvas.Point?]>();
expectTypeOf(circle.pointAtAngle(Math.PI / 3)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(
  circle.pointsBetween({ x: 100, y: 72 }, somePoint, {
    density: 5,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(
  circle.pointsForArc(Math.PI / 5, Math.PI / 4, {
    density: null,
    includeEndpoints: false,
  }),
).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(
  circle.toPolygon({
    density: undefined,
    includeEndpoints: null,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(circle.intersectPolygon(somePoly)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.intersectPolygon(somePoly, {
    weilerAtherton: false,
    clipType: ClipperLib.ClipType.ctDifference,
    density: 5,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.intersectPolygon(somePoly, {
    weilerAtherton: true,
    canMutate: true,
    clipType: null,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(
  circle.intersectClipper(clipperPoints, {
    clipType: undefined,
    density: 2,
    scalingFactor: 2,
  }),
).toEqualTypeOf<PIXI.Polygon>;
