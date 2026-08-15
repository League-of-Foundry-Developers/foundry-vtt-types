export {};

declare global {
  /**
   * This is a specialized version of earcut, updated to take into account links between outer edges and holes whenever possible.
   * Modified by Foundry LLC
   */
  interface EarcutEdges {
    /**
     * @remarks Triangulates a flat array of vertex coordinates, three per vertex, and returns a flat
     * array of vertex indices, three per triangle. `holeIndices` holds the first vertex index of each
     * hole, and may be omitted or `null` for a polygon without holes.
     */
    (data: number[], holeIndices?: number[] | null): number[];

    /**
     * turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
     */
    flatten(data: number[][][]): EarcutEdges.FlattenResult;

    /**
     * return a percentage difference between the polygon area and its triangulation area;
     * used to verify correctness of triangulation
     */
    deviation(data: number[], holeIndices: number[] | null | undefined, dim: number, triangles: number[]): number;
  }

  namespace EarcutEdges {
    interface FlattenResult {
      /** @remarks The flattened vertex coordinates, `dimensions` per vertex. */
      vertices: number[];

      /** @remarks The first vertex index of each hole. */
      holes: number[];

      /** @remarks The number of coordinates per vertex, taken from the first point of the first ring. */
      dimensions: number;
    }
  }

  interface Earcut {
    earcutEdges: EarcutEdges;
  }

  const earcut: Earcut;
}
