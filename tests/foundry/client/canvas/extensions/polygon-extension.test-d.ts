import { expectTypeOf } from "vitest";

import WeilerAthertonClipper = foundry.canvas.geometry.WeilerAthertonClipper;

const somePoint = { x: 50, y: 23 };
declare const otherPoly: PIXI.Polygon;
declare const someCircle: PIXI.Circle;
declare const someRect: PIXI.Rectangle;
const clipperPoints = [
  { X: 50, Y: 50 },
  { X: 50, Y: 100 },
  { X: 100, Y: 100 },
  { X: 100, Y: 50 },
];

expectTypeOf(PIXI.Polygon.fromClipperPoints(clipperPoints)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(PIXI.Polygon.fromClipperPoints(clipperPoints, { scalingFactor: 4 })).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(PIXI.Polygon.fromClipperPoints(clipperPoints, { scalingFactor: undefined })).toEqualTypeOf<PIXI.Polygon>();

const myPoly = new PIXI.Polygon([0, 1, 2, 3]);

expectTypeOf(myPoly.isPositive).toBeBoolean();
expectTypeOf(myPoly._isPositive).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myPoly.clearCache()).toBeVoid();
expectTypeOf(myPoly.signedArea()).toBeNumber();
expectTypeOf(myPoly.reverseOrientation()).toEqualTypeOf<typeof myPoly>();
expectTypeOf(myPoly.addPoint(somePoint)).toEqualTypeOf<typeof myPoly>();
expectTypeOf(myPoly.getBounds()).toEqualTypeOf<PIXI.Rectangle>();

expectTypeOf(myPoly.toClipperPoints()).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(myPoly.toClipperPoints({ scalingFactor: 40 })).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(myPoly.toClipperPoints({ scalingFactor: undefined })).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();

expectTypeOf(myPoly.isClosed).toBeBoolean();

expectTypeOf(myPoly.intersectPolygon(otherPoly)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectPolygon(otherPoly, {
    clipType: ClipperLib.ClipType.ctIntersection,
    scalingFactor: 4,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectPolygon(otherPoly, {
    clipType: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(myPoly.intersectClipper(clipperPoints)).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(
  myPoly.intersectClipper(clipperPoints, {
    clipType: ClipperLib.ClipType.ctXor,
    scalingFactor: 50,
  }),
).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(
  myPoly.intersectClipper(clipperPoints, {
    clipType: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();

expectTypeOf(myPoly.intersectCircle(someCircle)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectCircle(someCircle, {
    clipType: ClipperLib.ClipType.ctUnion,
    density: 3,
    scalingFactor: 2,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectCircle(someCircle, {
    clipType: undefined,
    density: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(myPoly.intersectRectangle(someRect)).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    weilerAtherton: false,
    clipType: ClipperLib.ClipType.ctDifference,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// @ts-expect-error Can't pass `canMutate` if we're not on the WAC path
myPoly.intersectRectangle(someRect, { weilerAtherton: false, canMutate: true });

expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    weilerAtherton: true,
    canMutate: true,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// weilerAtherton: true is default
expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    canMutate: true,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// @ts-expect-error Can't pass `scalingFactor` on the WAC branch
myPoly.intersectRectangle(someRect, { weilerAtherton: true, scalingFactor: CONST.CLIPPER_SCALING_FACTOR });

expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    weilerAtherton: undefined,
    canMutate: undefined,
    clipType: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  myPoly.intersectRectangle(someRect, {
    weilerAtherton: false,
    clipType: undefined,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
