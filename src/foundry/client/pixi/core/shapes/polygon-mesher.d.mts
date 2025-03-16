import type { Identity, IntentionalPartial } from "fvtt-types/utils";

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
     * @remarks `options` is `IntentionalPartial`'d because the constructor immediately does
     * `this.options = {...this.constructor._defaultOptions, ...options}`, so explicit `undefined` would break things
     */
    constructor(poly: PIXI.Polygon.OrPointsFlat, options?: IntentionalPartial<PolygonMesher.Options>);

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
     * @throws If `dimension < 2`
     * @privateRemarks Foundry types this return as `number[] | undefined`, but it cannot return either of those;
     * Either it will throw or return a (possibly empty) `ClipperLib.Path` (an array-like of `ClipperLib.IntPoint`s)
     */
    static getClipperPathFromPoints(poly: PIXI.Polygon.OrPointsFlat, dimension?: number): ClipperLib.Path;

    /**
     * Execute the triangulation to create indices
     * @param geometry - A geometry to update
     * @returns The resulting geometry
     */
    triangulate(geometry: PIXI.Geometry): PIXI.Geometry;
  }

  namespace PolygonMesher {
    interface Any extends AnyPolygonMesher {}
    interface AnyConstructor extends Identity<typeof AnyPolygonMesher> {}

    /**
     *  @remarks These properties all have non-nullish values in `_defaultOptions`, and explicit `undefined` breaks
     * things that aren't `boolean` due to math and object spread syntax in the constructor. `null` has been allowed
     * where its casting to `0` or `false` doesn't break things.
     */
    interface Options {
      /**
       * The position value in pixels
       * @defaultValue `0`
       * @remarks Can't be `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      offset: number | null;

      /**
       * Should the vertices be normalized?
       * @defaultValue `false`
       */
      normalize: boolean | undefined | null;

      /**
       * The x origin
       * @defaultValue `0`
       * @remarks Can't be `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      x: number | null;

      /**
       * The y origin
       * @defaultValue `0`
       * @remarks Can't be `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      y: number | null;

      /**
       * The radius
       * @defaultValue `0`
       * @remarks Can't be `null` because of an `=== 0` check, nor `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      radius: number;

      /**
       * The depth value on the outer polygon
       * @defaultValue `0`
       * @remarks Can't be `null` as it can be pushed directly into a `number[]`, nor `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      depthOuter: number;

      /**
       * The depth value on the inner polygon
       * @defaultValue `1`
       * @remarks Can't be `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      depthInner: number | null;

      /**
       * Constant multiplier to avoid floating point imprecision with ClipperLib
       * @defaultValue `10e8`
       * @remarks Not allowing `null` because a zero value here defeats the purpose, and `undefined` because the default is provided by spread operator and the value is used directly in math
       */
      scale: number;

      /**
       * Distance of the miter limit, when sharp angles are cut during offsetting.
       * @defaultValue `7`
       * @remarks Allowed to be `undefined` but not `null` because it is passed to
       * `new ClipperLib.ClipperOffset()`, which provides its own default if `=== undefined`
       */
      miterLimit: number | undefined;

      /**
       * Should the vertex data be interleaved into one VBO?
       * @defaultValue `false`
       */
      interleaved: boolean | undefined | null;
    }
  }
}

declare abstract class AnyPolygonMesher extends PolygonMesher {
  constructor(arg0: never, ...args: never[]);
}
