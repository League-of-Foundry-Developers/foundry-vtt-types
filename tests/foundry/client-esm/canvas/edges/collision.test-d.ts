import { expectTypeOf } from "vitest";

const myCollisionResult = new foundry.canvas.edges.CollisionResult();

expectTypeOf(myCollisionResult.target).toEqualTypeOf<foundry.canvas.edges.PolygonVertex | null>();
expectTypeOf(myCollisionResult.collisions).toEqualTypeOf<foundry.canvas.edges.PolygonVertex[]>();
expectTypeOf(myCollisionResult.cwEdges).toEqualTypeOf<Set<foundry.canvas.edges.Edge>>();
expectTypeOf(myCollisionResult.isBehind).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myCollisionResult.isLimited).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myCollisionResult.wasLimited).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myCollisionResult.limitedCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.limitedCCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCCW).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCWPrev).toEqualTypeOf<boolean>();
expectTypeOf(myCollisionResult.blockedCCWPrev).toEqualTypeOf<boolean>();
