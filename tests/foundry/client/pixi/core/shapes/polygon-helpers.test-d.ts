import { expectTypeOf } from "vitest";

const myVertex = new PolygonVertex(2, 2);

expectTypeOf(myVertex.equals(myVertex)).toEqualTypeOf<boolean>();

// Test this as part of Walls
// const myEdge = new PolygonEdge(2,2,CONST.WALL_SENSE_TYPES.LIMITED,myWall)

const myCollisionResult = new CollisionResult();

expectTypeOf(myCollisionResult.cwEdges).toEqualTypeOf<Set<PolygonEdge>>();
