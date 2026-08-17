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
  edgeTypes: {
    source: { mode: 2, priority: 3 },
    wall: false,
    innerBounds: true,
    outerBounds: { mode: 1 },
  },
  edgeDirectionMode: CONST.EDGE_DIRECTION_MODES.REVERSED,
  externalRadius: 750,
  priority: 2,
  radius: 500,
  rotation: 53,
  source: someVisionSource,
  useThreshold: true,

  // deprecated since v13:
  includeDarkness: true,
  useInnerBounds: true,

  // deprecated since v14:
  edgeOptions: {
    source: true,
    wall: false,
    innerBounds: true,
    outerBounds: true,
  },
  wallDirectionMode: CONST.EDGE_DIRECTION_MODES.REVERSED,
} satisfies ClockwiseSweepPolygon.Config;

const maximumInexactConfig = {
  type: "sight", // required
  angle: undefined,
  boundaryShapes: undefined,
  boundingBox: undefined,
  debug: undefined,
  density: undefined,
  edgeTypes: {
    source: undefined,
    wall: undefined,
    innerBounds: undefined,
    outerBounds: undefined,
  },
  edgeDirectionMode: undefined,
  externalRadius: 750, // not allowed to be explicitly undefined
  priority: undefined,
  radius: undefined,
  rotation: undefined,
  source: undefined,
  useThreshold: undefined,

  // deprecated since v13:
  includeDarkness: undefined,
  useInnerBounds: undefined,

  // deprecated since v14:
  edgeOptions: undefined,
  wallDirectionMode: undefined,
} satisfies ClockwiseSweepPolygon.Config;

// Inherited or overridden from PointSourcePolygon tests

// Deprecated since v14: the getter returns `CONST.EDGE_DIRECTION_MODES` itself, so its members must stay
// assignable to `edgeDirectionMode` for the documented migration path to typecheck.
/* eslint-disable @typescript-eslint/no-deprecated */
expectTypeOf(ClockwiseSweepPolygon.WALL_DIRECTION_MODES).toEqualTypeOf<typeof CONST.EDGE_DIRECTION_MODES>();
expectTypeOf(ClockwiseSweepPolygon.WALL_DIRECTION_MODES.REVERSED).toEqualTypeOf<
  typeof CONST.EDGE_DIRECTION_MODES.REVERSED
>();
ClockwiseSweepPolygon.create(point, {
  type: "sight",
  edgeDirectionMode: ClockwiseSweepPolygon.WALL_DIRECTION_MODES.REVERSED,
});
/* eslint-enable @typescript-eslint/no-deprecated */

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
expectTypeOf(myCSP.origin).toEqualTypeOf<Canvas.ElevatedPoint | undefined>();
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

expectTypeOf(
  myCSP["_testCollision"](someRay, "all", elevatedPoint, 0, 1),
).toEqualTypeOf<PointSourcePolygon.TestCollision>();
expectTypeOf(myCSP["_testCollision"](someRay, "any", elevatedPoint, 0, 1)).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"any">
>();
expectTypeOf(myCSP["_testCollision"](someRay, "closest", elevatedPoint, 0, 1)).toEqualTypeOf<
  PointSourcePolygon.TestCollision<"closest">
>();

expectTypeOf(myCSP.visualize()).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(myCSP.isCompleteCircle()).toBeBoolean();

// ClockwiseSweep-only tests

expectTypeOf(myCSP.vertices).toEqualTypeOf<Map<number, edges.PolygonVertex>>();
expectTypeOf(myCSP.edges).toEqualTypeOf<Set<edges.Edge>>();
expectTypeOf(myCSP.rays).toEqualTypeOf<ClockwiseSweepPolygon.Ray[]>();
expectTypeOf(myCSP.useInnerBounds).toBeBoolean();

expectTypeOf(myCSP["_edgeTypes"]).toEqualTypeOf<ClockwiseSweepPolygon.ResolvedEdgeTypes>();

expectTypeOf(myCSP["_determineEdgeTypes"]("innerBounds", 7)).toEqualTypeOf<ClockwiseSweepPolygon.ResolvedEdgeTypes>();
expectTypeOf(
  myCSP["_determineEdgeTypes"]("source", 6, minimalConfig),
).toEqualTypeOf<ClockwiseSweepPolygon.ResolvedEdgeTypes>();
expectTypeOf(
  myCSP["_determineEdgeTypes"]("wall", 0, maximumConfig),
).toEqualTypeOf<ClockwiseSweepPolygon.ResolvedEdgeTypes>();

expectTypeOf(myCSP["_identifyEdges"]()).toBeVoid();

expectTypeOf(
  myCSP["_testEdgeInclusion"](someEdge, {
    wall: { mode: 1, priority: 0 },
    innerBounds: { mode: 2, priority: -Infinity },
    source: { mode: 0, priority: -Infinity },
    outerBounds: { mode: 2, priority: -Infinity },
  }),
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

// New in v14: polygons are computed relative to a Level

expectTypeOf(myCSP.level).toEqualTypeOf<foundry.documents.Level.Implementation>();
expectTypeOf(myCSP.scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(myCSP.surfaceExposure).toEqualTypeOf<foundry.data.PolygonTree | null | undefined>();
expectTypeOf(myCSP.config.level).toEqualTypeOf<foundry.documents.Level.Implementation>();
expectTypeOf(
  myCSP.config.surfaceExposure,
).toEqualTypeOf<foundry.canvas.geometry.ElevatedSurfaceExposureGenerator.Options>();

// New in v14: `tMin`/`tMax` bound which ray intersections count as collisions
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(point, point, { mode: "any", tMin: 0.25, tMax: 0.75, ...minimalCollisionConfig }),
).toBeBoolean();
expectTypeOf(
  ClockwiseSweepPolygon.testCollision(point, point, {
    mode: "any",
    tMin: undefined,
    tMax: undefined,
    ...minimalCollisionConfig,
  }),
).toBeBoolean();
