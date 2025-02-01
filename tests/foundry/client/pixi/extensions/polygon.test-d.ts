import { expectTypeOf } from "vitest";

declare const somePoint: PIXI.Point;
declare const otherPoly: PIXI.Polygon;
declare const someCircle: PIXI.Circle;
declare const someRect: PIXI.Rectangle;
const clipperPoints = [
  { X: 50, Y: 50 },
  { X: 50, Y: 100 },
  { X: 100, Y: 100 },
  { X: 100, Y: 50 },
];

expectTypeOf(PIXI.Polygon.fromClipperPoints(clipperPoints, { scalingFactor: 4 })).toEqualTypeOf<PIXI.Polygon>();

const myPoly = new PIXI.Polygon([0, 1, 2, 3]);

expectTypeOf(myPoly.isPositive).toBeBoolean();
expectTypeOf(myPoly.addPoint(somePoint)).toEqualTypeOf<typeof myPoly>();
expectTypeOf(myPoly.toClipperPoints({ scalingFactor: 1.2 })).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();

expectTypeOf(
  myPoly.intersectPolygon(otherPoly, {
    clipType: ClipperLib.ClipType.ctIntersection,
    scalingFactor: 4,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(
  myPoly.intersectClipper(clipperPoints, {
    clipType: ClipperLib.ClipType.ctXor,
    scalingFactor: 1.4,
  }),
).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();

expectTypeOf(
  myPoly.intersectCircle(someCircle, {
    clipType: ClipperLib.ClipType.ctUnion,
    density: 3,
    scalingFactor: 2,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    weilerAtherton: true,
    canMutate: false,
    clipType: ClipperLib.ClipType.ctXor,
  }),
).toEqualTypeOf<PIXI.Polygon>();
