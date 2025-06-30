import { expectTypeOf } from "vitest";

import Edge = foundry.canvas.geometry.edges.Edge;
import PolygonVertex = foundry.canvas.geometry.edges.PolygonVertex;
import Canvas = foundry.canvas.Canvas;
import type { LineIntersection } from "#common/utils/geometry.mjs";

expectTypeOf(PolygonVertex.getKey(17, 245)).toBeNumber();
declare const p: Canvas.Point;
expectTypeOf(PolygonVertex.fromPoint(p)).toEqualTypeOf<PolygonVertex>();

new PolygonVertex(1, 10);
new PolygonVertex(2, 37, { distance: undefined, index: undefined, round: undefined });
const vertex = new PolygonVertex(2, 2, { distance: 100, index: 7, round: true });

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
expectTypeOf(vertex["_distance"]).toEqualTypeOf<number | undefined>();
expectTypeOf(vertex["_d2"]).toEqualTypeOf<number | undefined>();
expectTypeOf(vertex["_index"]).toEqualTypeOf<number | undefined>();
expectTypeOf(vertex["_angle"]).toEqualTypeOf<number | undefined>();
expectTypeOf(vertex["_intersectionCoordinates"]).toEqualTypeOf<LineIntersection | undefined>();
expectTypeOf(vertex.isLimited).toEqualTypeOf<boolean>();

declare const edge: Edge;
expectTypeOf(vertex.attachEdge(edge, 3, "light")).toEqualTypeOf<void>();
expectTypeOf(vertex.equals(vertex)).toEqualTypeOf<boolean>();
expectTypeOf(vertex.isTerminal).toBeBoolean();
expectTypeOf(vertex.equals(vertex)).toBeBoolean();
