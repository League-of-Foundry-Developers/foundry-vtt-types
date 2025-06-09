import { expectTypeOf } from "vitest";
import { CanvasEdges, Edge } from "#client/canvas/geometry/edges/_module.mjs";

const myCanvasEdges = new CanvasEdges();

// Calls inside of Canvas
expectTypeOf(myCanvasEdges.initialize()).toEqualTypeOf<void>();
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<Edge>();
}
