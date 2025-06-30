import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import WeilerAthertonClipper = foundry.canvas.geometry.WeilerAthertonClipper;

expectTypeOf(PIXI.Rectangle.CS_ZONES).toExtend<Record<keyof PIXI.Rectangle.CS_Zones, PIXI.Rectangle.CS_ZONES>>();

expectTypeOf(PIXI.Rectangle.fromRotation(50, 50, 500, 500, Math.PI / 2)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(PIXI.Rectangle.fromRotation(50, 50, 500, 500, Math.PI / 2, somePIXIPoint)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(
  PIXI.Rectangle.fromRotation(50, 50, 500, 500, Math.PI / 2, somePIXIPoint, otherRect),
).toEqualTypeOf<PIXI.Rectangle>();

const rect = new PIXI.Rectangle(64, 64, 100, 100);
const clipperPoints = [
  { X: 50, Y: 50 },
  { X: 50, Y: 100 },
  { X: 100, Y: 100 },
  { X: 100, Y: 50 },
];

const somePoint = { x: 5000, y: 12345 };
declare const somePIXIPoint: PIXI.Point;
declare const otherRect: PIXI.Rectangle;
declare const somePolygon: PIXI.Polygon;

expectTypeOf(rect.center).toEqualTypeOf<Canvas.Point>();
expectTypeOf(rect.pointIsOn(somePoint)).toBeBoolean();
expectTypeOf(rect._getEdgeZone(somePoint)).toEqualTypeOf<PIXI.Rectangle.CS_ZONES>();
expectTypeOf(rect.pointsBetween({ x: 40, y: 30 }, { x: 200, y: 300 })).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(rect.segmentIntersections(somePoint, { x: 400, y: 200 })).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(rect.intersection(otherRect)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(rect.toPolygon()).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(rect.leftEdge).toEqualTypeOf<PIXI.Rectangle.Edge>();
expectTypeOf(rect.rightEdge).toEqualTypeOf<PIXI.Rectangle.Edge>();
expectTypeOf(rect.topEdge).toEqualTypeOf<PIXI.Rectangle.Edge>();
expectTypeOf(rect.bottomEdge).toEqualTypeOf<PIXI.Rectangle.Edge>();
expectTypeOf(rect._getZone(somePoint)).toEqualTypeOf<PIXI.Rectangle.CS_ZONES>();

expectTypeOf(rect.lineSegmentIntersects(somePoint, { x: 40, y: 20 })).toEqualTypeOf<boolean>();
expectTypeOf(rect.lineSegmentIntersects(somePoint, { x: 40, y: 20 }, { inside: true })).toEqualTypeOf<boolean>();
expectTypeOf(rect.lineSegmentIntersects(somePoint, { x: 40, y: 20 }, { inside: undefined })).toEqualTypeOf<boolean>();

// no options
expectTypeOf(rect.intersectPolygon(somePolygon)).toEqualTypeOf<PIXI.Polygon>();

// regular options, split by weilerAtherton truthiness
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    weilerAtherton: true,
    canMutate: false,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    weilerAtherton: undefined,
    canMutate: false,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    weilerAtherton: false,
    clipType: ClipperLib.ClipType.ctDifference,
    scalingFactor: 2,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// the two WAC CLIP_TYPES map exactly to equivalents in ClipperLib.ClipTypes, so they're allowed, as is the partial inverse
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    weilerAtherton: false,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
    scalingFactor: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    weilerAtherton: true,
    clipType: ClipperLib.ClipType.ctIntersection,
    canMutate: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon>();

expectTypeOf(rect.intersectClipper(clipperPoints)).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(
  rect.intersectClipper(clipperPoints, { clipType: ClipperLib.ClipType.ctDifference, scalingFactor: 3 }),
).toEqualTypeOf<PIXI.Polygon.ClipperPoint[]>();
expectTypeOf(rect.intersectClipper(clipperPoints, { clipType: undefined, scalingFactor: undefined })).toEqualTypeOf<
  PIXI.Polygon.ClipperPoint[]
>();

expectTypeOf(rect.overlaps(otherRect)).toEqualTypeOf<boolean>();
expectTypeOf(rect.normalize()).toEqualTypeOf<PIXI.Rectangle>();

expectTypeOf(rect.rotate((4 / 5) * Math.PI)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(rect.rotate((4 / 5) * Math.PI, somePIXIPoint)).toEqualTypeOf<PIXI.Rectangle>();
