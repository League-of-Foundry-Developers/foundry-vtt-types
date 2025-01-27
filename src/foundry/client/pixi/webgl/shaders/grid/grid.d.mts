import type { NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * The grid shader used by {@link GridMesh}.
   */
  class GridShader extends AbstractBaseShader {
    /**
     * The grid type uniform.
     */
    static TYPE_UNIFORM: string;

    /**
     * The grid thickness uniform.
     */
    static THICKNESS_UNIFORM: string;

    /**
     * The grid color uniform.
     */
    static COLOR_UNIFORM: string;

    /**
     * The resolution (pixels per grid space units) uniform.
     */
    static RESOLUTION_UNIFORM: string;

    /**
     * The antialiased step function.
     * The edge and x values is given in grid space units.
     */
    static ANTIALIASED_STEP_FUNCTION: string;

    /**
     * The line converage function, which returns the alpha value at a point with the given distance (in grid space units)
     * from an antialiased line (or point) with the given thickness (in grid space units).
     */
    static LINE_COVERAGE_FUNCTION: string;

    /**
     * Hexagonal functions conversion for between grid and cube space.
     */
    static HEXAGONAL_FUNCTIONS: string;

    /**
     * Get the nearest vertex of a grid space to the given point.
     */
    static NEAREST_VERTEX_FUNCTION: string;

    /**
     * This function returns the distance to the nearest edge of a grid space given a point.
     */
    static EDGE_DISTANCE_FUNCTION: string;

    /**
     * This function returns an vector (x, y, z), where
     * - x is the x-offset along the nearest edge,
     * - y is the y-offset (the distance) from the nearest edge, and
     * - z is the length of the nearest edge.
     */
    static EDGE_OFFSET_FUNCTION: string;

    /**
     * A function that draws the grid given a grid point, style, thickness, and color.
     */
    static DRAW_GRID_FUNCTION: string;

    static override vertexShader: string;

    static override get fragmentShader(): string;

    /**
     * The fragment shader source. Subclasses can override it.
     */
    protected static _fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   canvasDimensions: [1, 1],
     *   meshDimensions: [0, 0, 1, 1],
     *   sceneDimensions: [0, 0, 1, 1],
     *   screenDimensions: [1, 1],
     *   gridSize: 1,
     *   type: 0,
     *   thickness: 0,
     *   resolution: 0,
     *   color: [0, 0, 0, 0],
     *   alpha: 0,
     *   style: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Configure the shader.
     */
    configure(options?: NullishProps<{ style: AbstractBaseShader.UniformValue }>): void;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  namespace GridShader {
    interface Any extends AnyGridShader {}
    type AnyConstructor = typeof AnyGridShader;
  }
}

declare abstract class AnyGridShader extends GridShader {
  constructor(arg0: never, ...args: never[]);
}
