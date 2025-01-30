import { expectTypeOf } from "vitest";

const vertex = new foundry.canvas.edges.PolygonVertex(2, 2);

expectTypeOf(vertex.x).toEqualTypeOf<number>();
expectTypeOf(vertex.y).toEqualTypeOf<number>();
expectTypeOf(vertex.key).toEqualTypeOf<number>();
expectTypeOf(vertex.edges).toEqualTypeOf<EdgeSet>();
expectTypeOf(vertex.cwEdges).toEqualTypeOf<EdgeSet>();
expectTypeOf(vertex.ccwEdges).toEqualTypeOf<EdgeSet>();
expectTypeOf(vertex.collinearVertices).toEqualTypeOf<Set<foundry.canvas.edges.PolygonVertex>>();
expectTypeOf(vertex.type).toEqualTypeOf<number | null>();
expectTypeOf(vertex.isEndpoint).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isLimitingCCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isLimitingCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isBlockingCCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isBlockingCW).toEqualTypeOf<boolean | undefined>();
expectTypeOf(vertex.isInternal).toEqualTypeOf<boolean>();
expectTypeOf(vertex.restriction).toEqualTypeOf<number>();
expectTypeOf(vertex._visited).toEqualTypeOf<boolean>();
expectTypeOf(vertex.isLimited).toEqualTypeOf<boolean>();

declare const edge: foundry.canvas.edges.Edge;
expectTypeOf(vertex.attachEdge(edge, 3, "")).toEqualTypeOf<void>();
expectTypeOf(vertex.equals(vertex)).toEqualTypeOf<boolean>();

declare const p: Canvas.Point;
expectTypeOf(foundry.canvas.edges.PolygonVertex.fromPoint(p)).toEqualTypeOf<foundry.canvas.edges.PolygonVertex>();
