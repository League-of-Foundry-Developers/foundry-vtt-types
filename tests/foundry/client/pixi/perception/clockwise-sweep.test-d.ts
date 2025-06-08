import { expectTypeOf } from "vitest";
import type PolygonVertex from "../../../../../src/foundry/client/canvas/edges/vertex.d.mts";

const pointA = new PIXI.Point(0, 0);
const pointB = new PIXI.Point(0, 0);
declare const someRect: PIXI.Rectangle;
declare const somePoly: PIXI.Polygon;
declare const someCircle: PIXI.Circle;
declare const someEdge: foundry.canvas.geometry.edges.Edge;
declare const somePV: foundry.canvas.geometry.edges.PolygonVertex;

expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { type: "light" })).toEqualTypeOf<PolygonVertex[]>();
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "any", type: "light" }),
).toEqualTypeOf<boolean>();
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "closest", type: "sound" }),
).toEqualTypeOf<PolygonVertex | null>();
expectTypeOf(ClockwiseSweepPolygon.testCollision(pointA, pointB, { mode: "all", type: "move" })).toEqualTypeOf<
  PolygonVertex[]
>();

let myCSP;
expectTypeOf(
  (myCSP = ClockwiseSweepPolygon.create(
    { x: 0, y: 0 },
    {
      type: "light",
    },
  )),
).toEqualTypeOf<ClockwiseSweepPolygon>();

expectTypeOf(
  myCSP.applyConstraint(somePoly, {
    clipType: ClipperLib.ClipType.ctXor,
    scalingFactor: 4,
  }),
).toEqualTypeOf<typeof myCSP>();

expectTypeOf(
  myCSP.applyConstraint(someRect, {
    weilerAtherton: false,
    clipType: ClipperLib.ClipType.ctDifference,
    scalingFactor: 2,
  }),
).toEqualTypeOf<typeof myCSP>();
expectTypeOf(
  myCSP.applyConstraint(someRect, {
    weilerAtherton: true,
    canMutate: false,
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
  }),
).toEqualTypeOf<typeof myCSP>();

expectTypeOf(
  myCSP.applyConstraint(someCircle, {
    weilerAtherton: false,
    clipType: ClipperLib.ClipType.ctUnion,
    scalingFactor: 2,
  }),
).toEqualTypeOf<typeof myCSP>();
expectTypeOf(
  myCSP.applyConstraint(someCircle, {
    weilerAtherton: true,
    clipType: ClipperLib.ClipType.ctIntersection,
    canMutate: null,
  }),
).toEqualTypeOf<typeof myCSP>();

expectTypeOf(myCSP.contains(50, 100)).toEqualTypeOf<boolean>();
expectTypeOf(myCSP["_testEdgeInclusion"](someEdge, { wall: 1, innerBounds: 2 }, someRect)).toEqualTypeOf<boolean>();

const edgeMap = new Map([["bob", someEdge]]);
const edgeSet = new Set([someEdge]);

expectTypeOf(myCSP["_identifyIntersections"](edgeMap)).toEqualTypeOf<void>();
expectTypeOf(myCSP["_isVertexBehindActiveEdges"](somePV, edgeSet)).toEqualTypeOf<{
  isBehind: boolean;
  wasLimited: boolean;
}>();
expectTypeOf(myCSP["_determineSweepResult"](somePV, edgeSet, false)).toEqualTypeOf<void>();
