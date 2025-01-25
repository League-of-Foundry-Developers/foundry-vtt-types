import type { InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * A helper class used to construct triangulated polygon meshes
   * Allow to add padding and a specific depth value.
   */
  class PolygonMesher {
    /**
     * @param poly    - Closed polygon to be processed and converted to a mesh
     *                  (array of points or PIXI Polygon)
     * @param options - Various options : normalizing, offsetting, add depth, ...
     */
    constructor(poly: number[] | PIXI.Polygon, options?: InexactPartial<PolygonMesherOptions>);

    /** Contains options to apply during the meshing process */
    options: PolygonMesherOptions;

    /** Default options values */
    static _defaultOptions: PolygonMesherOptions;

    /**
     * Polygon mesh vertices
     */
    vertices: number[];

    /**
     * Polygon mesh indices
     */
    indices: number[];

    /**
     * Convert a flat points array into a 2 dimensional ClipperLib path
     * @param poly      - PIXI.Polygon or points flat array.
     * @param dimension - Dimension.
     *                    (default 2)
     * @returns The clipper lib path.
     */
    static getClipperPathFromPoints(poly: number[] | PIXI.Polygon, dimension?: number): number[] | undefined;

    /**
     * Execute the triangulation to create indices
     * @param geometry - A geometry to update
     * @returns The resulting geometry
     */
    triangulate(geometry: PIXI.Geometry): PIXI.Geometry;
  }

  interface PolygonMesherOptions {
    /**
     * The position value in pixels
     * @defaultValue `0`
     */
    offset: number;

    /**
     * Should the vertices be normalized?
     * @defaultValue `false`
     */
    normalize: boolean;

    /**
     * The x origin
     * @defaultValue `0`
     */
    x: number;

    /**
     * The y origin
     * @defaultValue `0`
     */
    y: number;

    /**
     * The radius
     * @defaultValue `0`
     */
    radius: number;

    /**
     * The depth value on the outer polygon
     * @defaultValue `0`
     */
    depthOuter: number;

    /**
     * The depth value on the inner polygon
     * @defaultValue `1`
     */
    depthInner: number;

    /**
     * Constant multiplier to avoid floating point imprecision with ClipperLib
     * @defaultValue `10e8`
     */
    scale: number;

    /**
     * Distance of the miter limit, when sharp angles are cut during offsetting.
     * @defaultValue `7`
     */
    miterLimit: number;

    /**
     * Should the vertex data be interleaved into one VBO?
     * @defaultValue `false`
     */
    interleaved: boolean;
  }
}
