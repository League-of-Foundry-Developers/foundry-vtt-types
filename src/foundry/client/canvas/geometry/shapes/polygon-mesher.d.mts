import type { Identity, InexactPartial, IntentionalPartial } from "#utils";

/**
 * A helper class used to construct triangulated polygon meshes
 * Allow to add padding and a specific depth value.
 */
declare class PolygonMesher {
  /**
   * @param poly    - Closed polygon to be processed and converted to a mesh (array of points or PIXI Polygon)
   * @param options - Various options : normalizing, offsetting, add depth, ...
   */
  constructor(poly: PIXI.Polygon.OrPointsFlat, options?: PolygonMesher.ConstructorOptions);

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
   * Convert a flat points array into a 2 dimensional {@linkcode ClipperLib.Path | ClipperLib path}
   * @param poly      - PIXI.Polygon or points flat array.
   * @param dimension - Dimension. (default `2`)
   * @returns The clipper lib path.
   * @remarks
   * @throws If `dimension < 2`
   * @privateRemarks Foundry types this return as `| undefined`, but it will only ever throw
   * or return a (possibly empty) {@linkcode ClipperLib.Path}
   */
  static getClipperPathFromPoints(poly: PIXI.Polygon.OrPointsFlat, dimension?: number): ClipperLib.Path;

  /**
   * Execute the triangulation to create indices
   * @param geometry - A geometry to update
   * @returns The resulting geometry
   */
  triangulate(geometry: PIXI.Geometry): PIXI.Geometry;

  #PolygonMesher: true;
}

declare namespace PolygonMesher {
  interface Any extends AnyPolygonMesher {}
  interface AnyConstructor extends Identity<typeof AnyPolygonMesher> {}

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

  /**
   * `miterLimit` is allowed to be `undefined` because it's passed to {@linkcode ClipperLib.ClipperOffset | new ClipperLib.ClipperOffset()},
   *  which provides its own default if `=== undefined`
   * @internal
   */
  type _ConstructorOptions = IntentionalPartial<Pick<Options, Exclude<keyof Options, "miterLimit">>> &
    InexactPartial<Pick<Options, "miterLimit">>;

  /**
   * @remarks Properties are only made optional, not `| undefined`, because
   * {@linkcode PolygonMesher.constructor | the constructor} provides defaults
   * by spread operator:
   * ```js
   * constructor(poly, options = {}) {
   *   this.options = {...this.constructor._defaultOptions, ...options}
   * ```
   */
  interface ConstructorOptions extends _ConstructorOptions {}
}

export default PolygonMesher;

declare abstract class AnyPolygonMesher extends PolygonMesher {
  constructor(...args: never);
}
