import { expectTypeOf } from "vitest";

import CanvasEdges = foundry.canvas.geometry.edges.CanvasEdges;
import Edge = foundry.canvas.geometry.edges.Edge;
import Quadtree = foundry.canvas.geometry.Quadtree;

const myCanvasEdges = new CanvasEdges();
declare const someEdge: Edge;
declare const rect: PIXI.Rectangle;

// Calls inside of Canvas
expectTypeOf(myCanvasEdges.initialize()).toEqualTypeOf<void>();
expectTypeOf(myCanvasEdges.set("foo", someEdge)).toEqualTypeOf<CanvasEdges>();
expectTypeOf(myCanvasEdges.delete("foo")).toBeBoolean();
expectTypeOf(myCanvasEdges.clear()).toBeVoid();
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();

const ctf = (object: Quadtree.Object<Edge>, rect: PIXI.Rectangle) => {
  if (object.r.x > 5 && rect.width > 10) return true;
  return false;
};
expectTypeOf(myCanvasEdges.getEdges(rect)).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, { collisionTest: ctf, includeInnerBounds: true, includeOuterBounds: false }),
).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: undefined,
    includeInnerBounds: undefined,
    includeOuterBounds: undefined,
  }),
).toEqualTypeOf<Set<Edge>>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<Edge>();
}
