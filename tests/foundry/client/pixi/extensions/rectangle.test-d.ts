import { expectTypeOf } from "vitest";

const rect = new PIXI.Rectangle(64, 64, 100, 100);
const clipperPoints = [
  { X: 50, Y: 50 },
  { X: 50, Y: 100 },
  { X: 100, Y: 100 },
  { X: 100, Y: 50 },
];

declare const somePoint: PIXI.Point;
declare const otherRect: PIXI.Rectangle;
declare const somePolygon: PIXI.Polygon;

expectTypeOf(PIXI.Rectangle.fromRotation(50, 50, 500, 500, Math.PI / 2, somePoint)).toEqualTypeOf<PIXI.Rectangle>();

expectTypeOf(rect.CS_ZONES).toMatchTypeOf<Record<keyof PIXI.Rectangle.CS_Zones, PIXI.Rectangle.CS_ZONES>>();
expectTypeOf(rect._getEdgeZone(somePoint)).toEqualTypeOf<PIXI.Rectangle.CS_ZONES>();
expectTypeOf(rect._getZone(somePoint)).toEqualTypeOf<PIXI.Rectangle.CS_ZONES>();
expectTypeOf(rect.pointIsOn(somePoint)).toEqualTypeOf<boolean>();
expectTypeOf(rect.pointsBetween({ x: 40, y: 30 }, { x: 200, y: 300 })).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(rect.segmentIntersections(somePoint, { x: 400, y: 200 })).toEqualTypeOf<Canvas.Point[]>();
expectTypeOf(rect.intersection(otherRect)).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(rect.toPolygon()).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(rect.leftEdge).toEqualTypeOf<PIXI.Rectangle.Edge>();
expectTypeOf(rect.lineSegmentIntersects(somePoint, { x: 40, y: 20 })).toEqualTypeOf<boolean>();
expectTypeOf<PIXI.Rectangle.CS_ZONES>().toMatchTypeOf<number>();

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
    canMutate: null,
  }),
).toEqualTypeOf<PIXI.Polygon>();

// This return type (`| []`) is very probably a Foundry bug in v12.
expectTypeOf(
  rect.intersectClipper(clipperPoints, { clipType: ClipperLib.ClipType.ctDifference, scalingFactor: 3 }),
).toEqualTypeOf<PIXI.Polygon | []>();

expectTypeOf(rect.overlaps(otherRect)).toEqualTypeOf<boolean>();
