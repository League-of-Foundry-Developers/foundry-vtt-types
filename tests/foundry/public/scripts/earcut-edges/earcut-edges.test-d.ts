import { expectTypeOf } from "vitest";
expectTypeOf(earcut.earcutEdges).parameters.toEqualTypeOf<[data: number[], holeIndices: number[]]>;
expectTypeOf(earcut.earcutEdges).returns.toEqualTypeOf<number[]>;
expectTypeOf(earcut.earcutEdges.flatten).toEqualTypeOf<
  (data: number[][][]) => { vertices: number[]; holes: number[]; dimensions: number }
>;
expectTypeOf(earcut.earcutEdges.deviation).toEqualTypeOf<
  (data: number[], holeIndices: number[], dim: number, triangles: number[]) => number
>;
