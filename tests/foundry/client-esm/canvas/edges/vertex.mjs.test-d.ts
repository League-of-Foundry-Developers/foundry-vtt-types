import { expectTypeOf } from "vitest";

const myVertex = new foundry.canvas.edges.PolygonVertex(2, 2);

expectTypeOf(myVertex.equals(myVertex)).toEqualTypeOf<boolean>();
