import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.PointMovementSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(
  mySource.initialize({ x: 3, y: 5, elevation: 7 }),
).toEqualTypeOf<foundry.canvas.sources.PointMovementSource>();
