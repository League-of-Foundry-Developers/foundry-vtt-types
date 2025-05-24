import type { InexactPartial } from "#utils";

declare global {
  /**
   * The grid mesh, which uses the {@linkcode GridShader} to render the grid.
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
    data: GridMesh.MeshData;

    /**
     * Initialize and update the mesh given the (partial) data.
     * @param data - The (partial) data
     */
    initialize(data: GridMesh.InitializationMeshData): this;

    /**
     * Initialize the data of this mesh given the (partial) data.
     * @param data - The (partial) data.
     */
    protected _initialize(data: GridMesh.InitializationMeshData): void;
  }

  namespace GridMesh {
    /**
     * The grid mesh data.
     */
    interface MeshData {
      /**
       * The type of the grid (see {@linkcode CONST.GRID_TYPES})
       * @defaultValue `CONST.GRID_TYPES.GRIDLESS`
       */
      type: foundry.CONST.GRID_TYPES;

      /**
       * The width of the grid in pixels
       * @defaultValue `0`
       */
      width: number;

      /**
       * The height of the grid in pixels
       * @defaultValue `0`
       */
      height: number;

      /**
       * The size of a grid space in pixels
       * @defaultValue `0`
       */
      size: number;

      /**
       * The thickness of the grid lines in pixels
       * @defaultValue `1`
       */
      thickness: number;

      /**
       * The color of the grid
       * @defaultValue `0`
       */
      color: number;

      /**
       * The alpha of the grid
       * @defaultValue `1`
       */
      alpha: number;
    }

    interface InitializationMeshData extends InexactPartial<MeshData> {}
  }
}
