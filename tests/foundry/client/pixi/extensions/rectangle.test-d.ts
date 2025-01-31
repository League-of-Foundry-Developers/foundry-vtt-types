import { expectTypeOf } from "vitest";

const rect = new PIXI.Rectangle(64, 64, 100, 100);
declare const somePoint: PIXI.Point;
declare const otherRect: PIXI.Rectangle;
declare const somePolygon: PIXI.Polygon;

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

//TODO: This should be made to error, as `weilerAtherton` defaults to true
expectTypeOf(
  rect.intersectPolygon(somePolygon, {
    canMutate: false,
    clipType: ClipperLib.ClipType.ctXor,
    scalingFactor: 5,
  }),
).toEqualTypeOf<PIXI.Polygon>();
