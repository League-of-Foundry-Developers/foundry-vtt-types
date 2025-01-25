import type { InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * The grid mesh, which uses the {@link GridShader} to render the grid.
   */
  class GridMesh extends QuadMesh {
    /**
     * The grid mesh constructor.
     * @param shaderClass - The shader class
     */
    constructor(shaderClass: GridShader.AnyConstructor);

    /**
     * The data of this mesh.
     * @defaultValue
     * ```js
     * {
     *   type: CONST.GRID_TYPES.GRIDLESS,
     *   width: 0,
     *   height: 0,
     *   size: 0,
     *   thickness: 1,
     *   color: 0,
     *   alpha: 1
     * }
     * ```
     */
    data: GridMesh.Data;

    /**
     * Initialize and update the mesh given the (partial) data.
     * @param data - The (partial) data
     * @remarks InexactPartial is more correct as null has different behavior in _initialize
     */
    initialize(data: InexactPartial<GridMesh.Data>): this;

    /**
     * Initialize the data of this mesh given the (partial) data.
     * @param data - The (partial) data.
     * @remarks Can't be NullishProps because of `!== undefined` tests
     */
    protected _initialize(data: InexactPartial<GridMesh.Data>): void;
  }

  namespace GridMesh {
    /**
     * The grid mesh data.
     */
    interface Data {
      /** The type of the grid (see {@link CONST.GRID_TYPES}) */
      type: number;

      /** The width of the grid in pixels */
      width: number;

      /** The height of the grid in pixels */
      height: number;

      /** The size of a grid space in pixels */
      size: number;

      /** The thickness of the grid lines in pixels */
      thickness: number;

      /** The color of the grid */
      color: number;

      /** The alpha of the grid */
      alpha: number;
    }
  }
}
