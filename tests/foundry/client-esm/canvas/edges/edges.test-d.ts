import { expectTypeOf } from "vitest";

const myCanvasEdges = new foundry.canvas.edges.CanvasEdges();

// Calls inside of Canvas
expectTypeOf(myCanvasEdges.initialize()).toEqualTypeOf<void>();
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<foundry.canvas.edges.Edge>();
}
