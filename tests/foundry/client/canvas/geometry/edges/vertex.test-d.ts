import { expectTypeOf } from "vitest";
import { Edge, PolygonVertex } from "#client/canvas/geometry/edges/_module.mjs";

import Canvas = foundry.canvas.Canvas;

const vertex = new foundry.canvas.geometry.edges.PolygonVertex(2, 2);

expectTypeOf(vertex.x).toEqualTypeOf<number>();
expectTypeOf(vertex.y).toEqualTypeOf<number>();
expectTypeOf(vertex.key).toEqualTypeOf<number>();
expectTypeOf(vertex.edges).toEqualTypeOf<Set<Edge>>();
expectTypeOf(vertex.cwEdges).toEqualTypeOf<Set<Edge>>();
expectTypeOf(vertex.ccwEdges).toEqualTypeOf<Set<Edge>>();
expectTypeOf(vertex.collinearVertices).toEqualTypeOf<Set<PolygonVertex>>();
expectTypeOf(vertex.isEndpoint).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isLimitingCCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isLimitingCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isBlockingCCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isBlockingCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isInternal).toEqualTypeOf<boolean>();
expectTypeOf(vertex.restriction).toEqualTypeOf<CONST.WALL_SENSE_TYPES>();
expectTypeOf(vertex["_visited"]).toEqualTypeOf<boolean>();
expectTypeOf(vertex.isLimited).toEqualTypeOf<boolean>();

declare const edge: Edge;
expectTypeOf(vertex.attachEdge(edge, 3, "light")).toEqualTypeOf<void>();
expectTypeOf(vertex.equals(vertex)).toEqualTypeOf<boolean>();

declare const p: Canvas.Point;
expectTypeOf(foundry.canvas.geometry.edges.PolygonVertex.fromPoint(p)).toEqualTypeOf<PolygonVertex>();
