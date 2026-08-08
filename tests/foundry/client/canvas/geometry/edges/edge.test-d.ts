import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import Edge = foundry.canvas.geometry.edges.Edge;
import PolygonVertex = foundry.canvas.geometry.edges.PolygonVertex;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import Wall = foundry.canvas.placeables.Wall;

declare const p: Canvas.Point;
declare const someWall: Wall.Implementation;

new Edge(p, p);
new Edge(p, p, {
  type: undefined,
  sight: undefined,
  move: undefined,
  sound: undefined,
  light: undefined,
  darkness: undefined,
  id: undefined,
  object: undefined,
  direction: undefined,
  threshold: undefined,
  priority: undefined,
});
const edge = new Edge(p, p, {
  type: "source",
  sight: CONST.EDGE_SENSE_TYPES.DISTANCE,
  move: CONST.EDGE_SENSE_TYPES.LIMITED,
  sound: CONST.EDGE_SENSE_TYPES.PROXIMITY,
  light: CONST.EDGE_SENSE_TYPES.NONE,
  darkness: CONST.EDGE_SENSE_TYPES.NORMAL,
  id: foundry.utils.randomID(),
  object: someWall,
  direction: CONST.EDGE_DIRECTIONS.LEFT,
  threshold: {
    attenuation: true,
    sound: 400,
    light: 200,
    darkness: 100,
    sight: 2000,
  },
  priority: 7,
});

// `darkness` edges became `type: "source"` in v14
// @ts-expect-error "darkness" is no longer an Edge type
new Edge(p, p, { type: "darkness" });

expectTypeOf(edge.a).toEqualTypeOf<PIXI.Point>();
expectTypeOf(edge.b).toEqualTypeOf<PIXI.Point>();

expectTypeOf(edge.id).toEqualTypeOf<string | undefined>();
if (edge.object) expectTypeOf(edge.object).toEqualTypeOf<PlaceableObject.Any>();
expectTypeOf(edge.type).toEqualTypeOf<Edge.EdgeTypes>();
expectTypeOf(edge.direction).toEqualTypeOf<CONST.EDGE_DIRECTIONS>();
expectTypeOf(edge.light).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(edge.darkness).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(edge.move).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(edge.sight).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(edge.sound).toEqualTypeOf<CONST.EDGE_SENSE_TYPES>();
expectTypeOf(edge.threshold).toEqualTypeOf<Edge.ThresholdData | null>();
expectTypeOf(edge.nw).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.se).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(edge.intersections).toEqualTypeOf<Edge.Intersections>();

declare const levelId: string;
expectTypeOf(edge.intersections[levelId]).toEqualTypeOf<Edge.IntersectionEntry[] | undefined>();

if (edge.vertexA) expectTypeOf(edge.vertexA).toEqualTypeOf<PolygonVertex>();
expectTypeOf(edge.vertexB).toEqualTypeOf<PolygonVertex | undefined>();

expectTypeOf(edge.isLimited("sight")).toEqualTypeOf<boolean>();
expectTypeOf(edge.clone()).toEqualTypeOf<foundry.canvas.geometry.edges.Edge>();

declare const edge2: Edge;
expectTypeOf(edge.getIntersection(edge2)).toEqualTypeOf<foundry.utils.LineIntersection | void>();
expectTypeOf(edge.applyThreshold("sound", p)).toEqualTypeOf<boolean>();
expectTypeOf(edge.applyThreshold("darkness", p)).toEqualTypeOf<boolean>();
expectTypeOf(edge.orientPoint(p)).toEqualTypeOf<CONST.EDGE_DIRECTIONS>();
expectTypeOf(edge.recordIntersections(edge2, levelId)).toEqualTypeOf<void>();
expectTypeOf(edge.removeIntersections(levelId)).toEqualTypeOf<void>();

expectTypeOf(foundry.canvas.geometry.edges.Edge.identifyEdgeIntersections([edge2], levelId)).toEqualTypeOf<void>();
