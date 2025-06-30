import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import WeilerAthertonClipper = foundry.canvas.geometry.WeilerAthertonClipper;

expectTypeOf(PIXI.Circle.approximateVertexDensity(128)).toEqualTypeOf<number>();
expectTypeOf(PIXI.Circle.approximateVertexDensity(128, 5)).toEqualTypeOf<number>();

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
expectTypeOf(circle.pointIsOn(somePoint, 10e-6)).toEqualTypeOf<boolean>();

expectTypeOf(circle.segmentIntersections(somePoint, { x: 50, y: 50 })).toEqualTypeOf<[Canvas.Point?, Canvas.Point?]>();
expectTypeOf(circle.pointAtAngle(Math.PI / 3)).toEqualTypeOf<Canvas.Point>();

expectTypeOf(circle.pointsBetween({ x: 100, y: 72 }, somePoint)).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(
  circle.pointsBetween({ x: 100, y: 72 }, somePoint, {
    density: 5,
    includeEndpoints: true,
  }),
).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(
  circle.pointsBetween({ x: 100, y: 72 }, somePoint, {
    density: undefined,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(circle.pointsForArc(Math.PI / 5, Math.PI / 4)).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(
  circle.pointsForArc(Math.PI / 5, Math.PI / 4, {
    density: 10,
    includeEndpoints: false,
  }),
).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(
  circle.pointsForArc(Math.PI / 5, Math.PI / 4, {
    density: undefined,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(circle.toPolygon()).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.toPolygon({
    density: 10,
    includeEndpoints: false,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.toPolygon({
    density: undefined,
    includeEndpoints: undefined,
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

// @ts-expect-error Can't pass `canMutate` if we're not on the WAC path
circle.intersectPolygon(somePoly, { weilerAtherton: false, canMutate: true });

expectTypeOf(
  circle.intersectPolygon(somePoly, {
    weilerAtherton: true,
    canMutate: true,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// weilerAtherton: true is default
expectTypeOf(
  circle.intersectPolygon(somePoly, {
    canMutate: true,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// @ts-expect-error Can't pass `density` or `scalingFactor` on the WAC branch
circle.intersectPolygon(somePoly, { weilerAtherton: true, density: 7, scalingFactor: CONST.CLIPPER_SCALING_FACTOR });

expectTypeOf(
  circle.intersectPolygon(somePoly, {
    weilerAtherton: undefined,
    canMutate: undefined,
    clipType: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.intersectPolygon(somePoly, {
    weilerAtherton: false,
    clipType: undefined,
    density: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(circle.intersectClipper(clipperPoints)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.intersectClipper(clipperPoints, {
    clipType: ClipperLib.ClipType.ctDifference,
    density: 17,
    scalingFactor: CONST.CLIPPER_SCALING_FACTOR,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  circle.intersectClipper(clipperPoints, {
    clipType: undefined,
    density: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
