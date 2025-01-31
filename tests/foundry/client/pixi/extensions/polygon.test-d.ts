import { expectTypeOf } from "vitest";
//TODO: The following test will pass if/when `fromClipperPoints` can be successfully merged on the static side of PIXI.Polygon
// expectTypeOf(
//   PIXI.Polygon.fromClipperPoints(
//     [
//       { X: 50, Y: 50 },
//       { X: 50, Y: 100 },
//       { X: 100, Y: 100 },
//       { X: 100, Y: 50 },
//     ],
//     { scalingFactor: 4 },
//   ),
// ).toEqualTypeOf<PIXI.Polygon>();

declare const somePoint: PIXI.Point;
const myPoly = new PIXI.Polygon([0, 1, 2, 3]);

expectTypeOf(myPoly.isPositive).toBeBoolean();
expectTypeOf(myPoly.addPoint(somePoint)).toEqualTypeOf<typeof myPoly>();
expectTypeOf(myPoly.toClipperPoints({ scalingFactor: 1.2 })).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
