import { expectTypeOf } from "vitest";

import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import ClockwiseSweepPolygon = foundry.canvas.geometry.ClockwiseSweepPolygon;
import WeilerAthertonClipper = foundry.canvas.geometry.WeilerAthertonClipper;
import edges = foundry.canvas.geometry.edges;
import Ray = foundry.canvas.geometry.Ray;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;

import Canvas = foundry.canvas.Canvas;

const point = { x: 50, y: 200 };
const elevatedPoint = { x: 2000, y: 10, elevation: -20 };
declare const someRect: PIXI.Rectangle;
declare const somePoly: PIXI.Polygon;
declare const someCircle: PIXI.Circle;
declare const someEdge: edges.Edge;
declare const someRay: Ray;
declare const somePV: edges.PolygonVertex;
declare const someVisionSource: PointVisionSource.Implementation;

const minimalConfig = {
  type: "darkness",
} satisfies ClockwiseSweepPolygon.Config;

const minimalCollisionConfig = {
  type: "move", // must be in CONST.WALL_RESTRICTION_TYPES
} satisfies ClockwiseSweepPolygon.TestCollisionConfig;

// @ts-expect-error darkness is not a valid collision type
const _tcc: ClockwiseSweepPolygon.TestCollisionConfig = minimalConfig;

const maximumConfig = {
  type: "sight",
  angle: 270,
  boundaryShapes: [someRect, somePoly, someCircle],
  boundingBox: someRect,
  debug: false,
  density: 50,
  edgeOptions: {
    darkness: true,
    wall: false,
    innerBounds: true,
    light: false,
    outerBounds: true,
  },
  edgeTypes: {
    darkness: 2,
    wall: 0,
    innerBounds: 2,
    light: 1,
    outerBounds: 2,
  },
  externalRadius: 750,
  priority: 2,
  radius: 500,
  rotation: 53,
  source: someVisionSource,
  useThreshold: true,
  wallDirectionMode: PointSourcePolygon.WALL_DIRECTION_MODES.REVERSED,

  // deprecated since v13:
  includeDarkness: true,
  useInnerBounds: true,
} satisfies ClockwiseSweepPolygon.Config;

const maximumInexactConfig = {
  type: "sight", // required
  angle: undefined,
  boundaryShapes: undefined,
  boundingBox: undefined,
  debug: undefined,
  density: undefined,
  edgeOptions: {
    darkness: undefined,
    wall: undefined,
    innerBounds: undefined,
    light: undefined,
    outerBounds: undefined,
  },
  edgeTypes: {
    darkness: undefined,
    wall: undefined,
    innerBounds: undefined,
    light: undefined,
    outerBounds: undefined,
  },
  externalRadius: 750, // not allowed to be explicitly undefined
  priority: undefined,
  radius: undefined,
  rotation: undefined,
  source: undefined,
  useThreshold: undefined,
  wallDirectionMode: undefined,

  // deprecated since v13:
  includeDarkness: undefined,
  useInnerBounds: undefined,
} satisfies ClockwiseSweepPolygon.Config;

// Inherited or overridden from PointSourcePolygon tests

expectTypeOf(ClockwiseSweepPolygon.WALL_DIRECTION_MODES).toExtend<
  Record<keyof PointSourcePolygon.WallDirectionModes, PointSourcePolygon.WALL_DIRECTION_MODES>
>();

expectTypeOf(ClockwiseSweepPolygon.benchmark(50, point, minimalConfig)).toEqualTypeOf<Promise<void>>();
expectTypeOf(ClockwiseSweepPolygon.benchmark(50, elevatedPoint, minimalCollisionConfig)).toEqualTypeOf<Promise<void>>();
expectTypeOf(ClockwiseSweepPolygon.benchmark(50, point, maximumConfig)).toEqualTypeOf<Promise<void>>();
expectTypeOf(ClockwiseSweepPolygon.benchmark(50, elevatedPoint, maximumInexactConfig)).toEqualTypeOf<Promise<void>>();

// @ts-expect-error a config with at least a type is required
ClockwiseSweepPolygon.create(point);
expectTypeOf(ClockwiseSweepPolygon.create(elevatedPoint, minimalConfig)).toEqualTypeOf<ClockwiseSweepPolygon>();
expectTypeOf(ClockwiseSweepPolygon.create(point, maximumInexactConfig)).toEqualTypeOf<ClockwiseSweepPolygon>();
const myCSP = ClockwiseSweepPolygon.create(elevatedPoint, maximumConfig);

// @ts-expect-error options must include `type`, the one required config prop
ClockwiseSweepPolygon.testCollision(elevatedPoint, point, { mode: "any" });
// @ts-expect-error darkness is not a type of collision
ClockwiseSweepPolygon.testCollision(point, elevatedPoint, minimalConfig);
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(elevatedPoint, point, { mode: "any", ...minimalCollisionConfig }),
).toBeBoolean();
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(point, point, { mode: "closest", ...maximumConfig }),
).toEqualTypeOf<edges.PolygonVertex | null>();
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(elevatedPoint, elevatedPoint, { mode: "all", ...maximumInexactConfig }),
).toEqualTypeOf<edges.PolygonVertex[]>();

expectTypeOf(ClockwiseSweepPolygon.applyThresholdAttenuation(myCSP)).toEqualTypeOf<typeof myCSP>();

expectTypeOf(myCSP.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myCSP.origin).toEqualTypeOf<Canvas.ElevatedPoint>();
expectTypeOf(myCSP.config).toEqualTypeOf<ClockwiseSweepPolygon.StoredConfig>();
expectTypeOf(myCSP.isConstrained).toBeBoolean();
expectTypeOf(myCSP.clone()).toEqualTypeOf<typeof myCSP>();
expectTypeOf(myCSP.compute()).toEqualTypeOf<typeof myCSP>();
expectTypeOf(myCSP["_compute"]()).toBeVoid();

expectTypeOf(myCSP.initialize(elevatedPoint, minimalConfig)).toBeVoid();
expectTypeOf(myCSP.initialize(point, maximumInexactConfig)).toBeVoid();
expectTypeOf(myCSP.initialize(elevatedPoint, maximumConfig)).toBeVoid();

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
    canMutate: true,
  }),
).toEqualTypeOf<typeof myCSP>();

expectTypeOf(myCSP.contains(50, 100)).toEqualTypeOf<boolean>();
expectTypeOf(myCSP["_constrainBoundaryShapes"]()).toBeVoid();

expectTypeOf(myCSP["_testCollision"](someRay, "all")).toEqualTypeOf<PointSourcePolygon.TestCollision>();
expectTypeOf(myCSP["_testCollision"](someRay, "any")).toEqualTypeOf<PointSourcePolygon.TestCollision<"any">>();
expectTypeOf(myCSP["_testCollision"](someRay, "closest")).toEqualTypeOf<PointSourcePolygon.TestCollision<"closest">>();

expectTypeOf(myCSP.visualize()).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(myCSP.isCompleteCircle()).toBeBoolean();

// ClockwiseSweep-only tests

expectTypeOf(myCSP.vertices).toEqualTypeOf<Map<number, edges.PolygonVertex>>();
expectTypeOf(myCSP.edges).toEqualTypeOf<Set<edges.Edge>>();
expectTypeOf(myCSP.rays).toEqualTypeOf<ClockwiseSweepPolygon.Ray[]>();
expectTypeOf(myCSP.useInnerBounds).toBeBoolean();

expectTypeOf(
  myCSP["_determineEdgeTypes"]("innerBounds", 7),
).toEqualTypeOf<ClockwiseSweepPolygon.EdgeTypesConfiguration>();
expectTypeOf(
  myCSP["_determineEdgeTypes"]("darkness", 6, minimalConfig),
).toEqualTypeOf<ClockwiseSweepPolygon.EdgeTypesConfiguration>();
expectTypeOf(
  myCSP["_determineEdgeTypes"]("wall", 0, maximumConfig),
).toEqualTypeOf<ClockwiseSweepPolygon.EdgeTypesConfiguration>();

expectTypeOf(myCSP["_identifyEdges"]()).toBeVoid();

expectTypeOf(
  myCSP["_testEdgeInclusion"](someEdge, { wall: 1, innerBounds: 2, darkness: 0, light: undefined, outerBounds: 2 }),
).toEqualTypeOf<boolean>();

expectTypeOf(myCSP["_defineBoundingBox"]()).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myCSP["_identifyVertices"]()).toBeVoid();

const edgeMap = new Map([["bob", someEdge]]);
const edgeSet = new Set([someEdge]);

expectTypeOf(myCSP["_identifyIntersections"](edgeMap)).toEqualTypeOf<void>();
expectTypeOf(myCSP["_executeSweep"]()).toBeVoid();
expectTypeOf(myCSP["_initializeActiveEdges"]()).toEqualTypeOf<typeof edgeSet>();
expectTypeOf(myCSP["_sortVertices"]()).toEqualTypeOf<edges.PolygonVertex[]>();
expectTypeOf(myCSP["_isVertexBehindActiveEdges"](somePV, edgeSet)).toEqualTypeOf<{
  isBehind: boolean;
  wasLimited: boolean;
}>();

expectTypeOf(myCSP["_determineSweepResult"](somePV, edgeSet)).toEqualTypeOf<void>();
expectTypeOf(myCSP["_determineSweepResult"](somePV, edgeSet, false)).toEqualTypeOf<void>();

declare const collisionResult: edges.CollisionResult;
expectTypeOf(myCSP["_switchEdge"](collisionResult, edgeSet)).toBeVoid();

expectTypeOf(myCSP["_visualizeCollision"](someRay, [somePV, somePV])).toBeVoid();

expectTypeOf(myCSP.addPoint({ x: 37, y: 42 })).toEqualTypeOf<typeof myCSP>();
