import { expectTypeOf } from "vitest";

import CanvasEdges = foundry.canvas.geometry.edges.CanvasEdges;
import Edge = foundry.canvas.geometry.edges.Edge;
import Level = foundry.documents.Level;

declare const someLevel: Level;
const myCanvasEdges = new CanvasEdges(someLevel);
declare const someEdge: Edge;
declare const rect: PIXI.Rectangle;

// @ts-expect-error CanvasEdges may only be constructed with a Level instance
new CanvasEdges();

expectTypeOf(myCanvasEdges.level).toEqualTypeOf<Level>();

// Calls inside of Level and Scene
expectTypeOf(myCanvasEdges.set("foo", someEdge)).toEqualTypeOf<CanvasEdges>();
expectTypeOf(myCanvasEdges.delete("foo")).toBeBoolean();
expectTypeOf(myCanvasEdges.clear()).toEqualTypeOf<CanvasEdges>();

const ctf = (edge: Edge) => edge.type === "wall";

expectTypeOf(myCanvasEdges.getEdges(rect)).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: ctf,
    collisionTestBounds: true,
    includeInnerBounds: true,
    includeOuterBounds: false,
  }),
).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: undefined,
    collisionTestBounds: undefined,
    includeInnerBounds: undefined,
    includeOuterBounds: undefined,
  }),
).toEqualTypeOf<Set<Edge>>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<Edge>();
}

expectTypeOf(myCanvasEdges.identifyIntersections()).toEqualTypeOf<void>();

// Deprecated since v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.inititalize()).toEqualTypeOf<never>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.initialize()).toEqualTypeOf<void>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();
