import type { IntentionalPartial } from "fvtt-types/utils";

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
     * @remarks IntentionalPartial because the object is spread into an object with exisitng keys, so explicit `undefined` would break things
     */
    constructor(poly: number[] | PIXI.Polygon, options?: IntentionalPartial<PolygonMesher.Options>);

    /** Default options values */
    static _defaultOptions: PolygonMesher.Options;

    /**
     * Polygon mesh vertices
     */
    vertices: number[];

    /**
     * Polygon mesh indices
     */
    indices: number[];

    /** Contains options to apply during the meshing process */
    options: PolygonMesher.Options;

    /**
     * Convert a flat points array into a 2 dimensional ClipperLib path
     * @param poly      - PIXI.Polygon or points flat array.
     * @param dimension - Dimension.
     *                    (default 2)
     * @returns The clipper lib path.
     * @privateRemarks Foundry types this return as `number[] | undefined`, but as far as I can tell it cannot return either of those,
     *                 either it will throw or return a (possibly empty) array of `ClipperLib.IntPoint`s
     */
    static getClipperPathFromPoints(poly: number[] | PIXI.Polygon, dimension?: number): ClipperLib.IntPoint[];

    /**
     * Execute the triangulation to create indices
     * @param geometry - A geometry to update
     * @returns The resulting geometry
     */
    triangulate(geometry: PIXI.Geometry): PIXI.Geometry;
  }

  namespace PolygonMesher {
    type AnyConstructor = typeof AnyPolygonMesher;

    interface Options {
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
}

declare abstract class AnyPolygonMesher extends PolygonMesher {
  constructor(arg0: never, ...args: never[]);
}
