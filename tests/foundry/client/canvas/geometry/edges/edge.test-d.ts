import { expectTypeOf } from "vitest";
import { Edge, PolygonVertex } from "#client/canvas/geometry/edges/_module.mjs";
import type { PlaceableObject, Wall } from "#client/canvas/placeables/_module.d.mts";

declare const p: Canvas.Point;
declare const someWall: Wall.Implementation;

const edge = new foundry.canvas.geometry.edges.Edge(p, p, {
  type: "darkness",
  sight: CONST.WALL_SENSE_TYPES.DISTANCE,
  move: CONST.WALL_SENSE_TYPES.LIMITED,
  sound: CONST.WALL_SENSE_TYPES.PROXIMITY,
  light: CONST.WALL_SENSE_TYPES.NONE,
  id: foundry.utils.randomID(),
  object: someWall,
  direction: CONST.WALL_DIRECTIONS.LEFT,
  threshold: {
    attenuation: true,
    sound: 400,
    light: 200,
    sight: 2000,
  },
});

expectTypeOf(edge.a).toEqualTypeOf<PIXI.Point>();
expectTypeOf(edge.b).toEqualTypeOf<PIXI.Point>();

expectTypeOf(edge.id).toEqualTypeOf<string | undefined>();
if (edge.object) expectTypeOf(edge.object).toEqualTypeOf<PlaceableObject.Any>();
expectTypeOf(edge.type).toEqualTypeOf<Edge.EdgeTypes>();
expectTypeOf(edge.direction).toEqualTypeOf<foundry.CONST.WALL_DIRECTIONS>();
expectTypeOf(edge.light).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.move).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.sight).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.sound).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.threshold).toEqualTypeOf<WallDocument.ThresholdData | undefined | null>();
expectTypeOf(edge.nw).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.se).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(edge.intersections).toEqualTypeOf<Edge.IntersectionEntry[]>();

if (edge.vertexA) expectTypeOf(edge.vertexA).toEqualTypeOf<PolygonVertex>();
expectTypeOf(edge.vertexB).toEqualTypeOf<PolygonVertex | undefined>();

expectTypeOf(edge.isLimited("sight")).toEqualTypeOf<boolean>();
expectTypeOf(edge.clone()).toEqualTypeOf<foundry.canvas.geometry.edges.Edge>();

declare const edge2: Edge;
expectTypeOf(edge.getIntersection(edge2)).toEqualTypeOf<foundry.utils.LineIntersection | void>();
expectTypeOf(edge.applyThreshold("sound", p)).toEqualTypeOf<boolean>();
expectTypeOf(edge.orientPoint(p)).toEqualTypeOf<foundry.CONST.WALL_DIRECTIONS>();
expectTypeOf(edge.recordIntersections(edge2)).toEqualTypeOf<void>();
expectTypeOf(edge.removeIntersections()).toEqualTypeOf<void>();

expectTypeOf(foundry.canvas.geometry.edges.Edge.identifyEdgeIntersections([edge2])).toEqualTypeOf<void>();
