export {};

declare global {
  interface EarcutEdges {
    (data: number[], holeIndices: number[]): number[];
    flatten(data: number[][][]): { vertices: number[]; holes: number[]; dimensions: number };
    deviation(data: number[], holeIndices: number[], dim: number, triangles: number[]): number;
  }

  const earcut: { earcutEdges: EarcutEdges };
}
