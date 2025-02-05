import { expectTypeOf } from "vitest";
import type Edge from "../../../../../src/foundry/client-esm/canvas/edges/edge.d.mts";
import type PolygonVertex from "../../../../../src/foundry/client-esm/canvas/edges/vertex.d.mts";

type NullishBoolean = boolean | undefined | null;
declare const somePV: PolygonVertex;
declare const someEdge: Edge;

const myCollisionResult = new foundry.canvas.edges.CollisionResult({
  target: somePV,
  isBehind: false,
  wasLimited: true,
  isLimited: false,
  cwEdges: new Set([someEdge]),
});

expectTypeOf(myCollisionResult.target).toEqualTypeOf<PolygonVertex>();
expectTypeOf(myCollisionResult.collisions).toEqualTypeOf<PolygonVertex[]>();
expectTypeOf(myCollisionResult.cwEdges).toEqualTypeOf<Set<Edge>>();
expectTypeOf(myCollisionResult.isBehind).toEqualTypeOf<NullishBoolean>();
expectTypeOf(myCollisionResult.isLimited).toEqualTypeOf<NullishBoolean>();
expectTypeOf(myCollisionResult.wasLimited).toEqualTypeOf<NullishBoolean>();
expectTypeOf(myCollisionResult.limitedCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.limitedCCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCWPrev).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCCWPrev).toEqualTypeOf<boolean>();
