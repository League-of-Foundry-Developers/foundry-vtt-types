import { expectTypeOf } from "vitest";

const myCollisionResult = new foundry.canvas.edges.CollisionResult();

expectTypeOf(myCollisionResult.cwEdges).toEqualTypeOf<Set<PolygonEdge>>();
