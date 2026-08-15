import { expectTypeOf } from "vitest";

expectTypeOf(earcut).toEqualTypeOf<Earcut>();
expectTypeOf(earcut.earcutEdges).toEqualTypeOf<EarcutEdges>();
expectTypeOf(earcut.earcutEdges).returns.toEqualTypeOf<number[]>;

declare const vertices: number[];
declare const holes: number[];

// `holeIndices` is guarded with `holeIndices && holeIndices.length`, so a polygon without holes may
// omit it or pass `null`.
expectTypeOf(earcut.earcutEdges(vertices, holes)).toEqualTypeOf<number[]>();
expectTypeOf(earcut.earcutEdges(vertices, null)).toEqualTypeOf<number[]>();
expectTypeOf(earcut.earcutEdges(vertices)).toEqualTypeOf<number[]>();

expectTypeOf(earcut.earcutEdges.flatten).toEqualTypeOf<(data: number[][][]) => EarcutEdges.FlattenResult>();
expectTypeOf(earcut.earcutEdges.flatten([[[0, 0, 0]]])).toEqualTypeOf<EarcutEdges.FlattenResult>();
expectTypeOf(earcut.earcutEdges.flatten([[[0, 0, 0]]]).vertices).toEqualTypeOf<number[]>();
expectTypeOf(earcut.earcutEdges.flatten([[[0, 0, 0]]]).holes).toEqualTypeOf<number[]>();
expectTypeOf(earcut.earcutEdges.flatten([[[0, 0, 0]]]).dimensions).toEqualTypeOf<number>();

expectTypeOf(earcut.earcutEdges.deviation).toEqualTypeOf<
  (data: number[], holeIndices: number[] | null | undefined, dim: number, triangles: number[]) => number
>();
expectTypeOf(earcut.earcutEdges.deviation(vertices, null, 3, [])).toEqualTypeOf<number>();
