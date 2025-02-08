import type { InexactPartial, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A CanvasLayer responsible for drawing a square grid
   */
  class GridLayer<
    DrawOptions extends GridLayer.DrawOptions = GridLayer.DrawOptions,
    TearDownOptions extends CanvasLayer.TearDownOptions = CanvasLayer.TearDownOptions,
  > extends CanvasLayer<DrawOptions, TearDownOptions> {
    /**
     * @remarks Due to the grid rework in v12 this points to a BaseGrid subclass rather than a GridLayer instance,
     *          however to avoid inheritance-based issues this is left as the intended GridLayer instance
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): GridLayer;

    /**
     * The grid mesh.
     * @defaultValue `undefined`
     */
    mesh: GridMesh | undefined;

    /**
     * The Grid Highlight container
     * @defaultValue `undefined`
     */
    highlight: PIXI.Container | undefined;

    /**
     * Map named highlight layers
     * @defaultValue `{}`
     */
    highlightLayers: Record<string, GridHighlight>;

    /**
     * @defaultValue
     * ```js
     * foundry.utils.mergeObject(super.layerOptions, {name: "grid"});
     * ```
     */
    static override get layerOptions(): GridLayer.LayerOptions;

    override options: GridLayer.LayerOptions;

    /**
     * Draw the grid
     * @param options - Override settings used in place of those saved to the Scene data
     */
    _draw(options?: DrawOptions): Promise<void>;

    /**
     * Creates the grid mesh.
     */
    protected _drawMesh(): Promise<ReturnType<GridMesh["initialize"]>>;

    /**
     * Initialize the grid mesh appearance and configure the grid shader.
     */
    initializeMesh(
      /**
       * @remarks Can't be NullishProps because ultimately `GridMesh#_initialize` does `!== undefined` checks
       */
      options?: InexactPartial<{
        /** The grid style */
        style: string; //TODO: Update as part of #2572 to keyof CONFIG["Canvas"]["gridStyles"];

        /** The grid thickness */
        thickness: number;

        /** The grid color */
        color: string;

        /** The grid alpha */
        alpha: number;
      }>,
    ): void;

    /**
     * Define a new Highlight graphic
     * @param name - The name for the referenced highlight layer
     */
    addHighlightLayer(name: string): GridHighlight;

    /**
     * Clear a specific Highlight graphic
     * @param name - The name for the referenced highlight layer
     */
    clearHighlightLayer(name: string): void;

    /**
     * Destroy a specific Highlight graphic
     * @param name - The name for the referenced highlight layer
     */
    destroyHighlightLayer(name: string): void;

    /**
     * Obtain the highlight layer graphic by name
     * @param name - The name for the referenced highlight layer
     */
    getHighlightLayer(name: string): GridHighlight | undefined;

    /**
     * Add highlighting for a specific grid position to a named highlight graphic
     * @param name    - The name for the referenced highlight layer
     * @param options - Options for the grid position that should be highlighted
     */
    highlightPosition(name: string, options: GridLayer.HighlightPositionOptions): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#type is deprecated. Use canvas.grid.type instead."`
     */
    get type(): foundry.CONST.GRID_TYPES;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#size is deprecated. Use canvas.grid.size instead.`
     */
    get size(): number;

    /**
     * @deprecated since v12, will be removed in v14
     * `"GridLayer#grid is deprecated. Use canvas.grid instead."`
     */
    grid: Canvas["grid"];

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#isNeighbor is deprecated. Use canvas.grid.testAdjacency instead."`
     */
    isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#w is deprecated in favor of canvas.grid.sizeX."`
     */
    get w(): number;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#h is deprecated in favor of canvas.grid.sizeY."`
     */
    get h(): number;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#isHex is deprecated. Use canvas.grid.isHexagonal instead."`
     */
    get isHex(): boolean;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#getTopLeft is deprecated. Use canvas.grid.getTopLeftPoint instead."`
     */
    getTopLeft(x: number, y: number): Canvas.PointArray;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#getCenter is deprecated. Use canvas.grid.getCenterPoint instead."`
     */
    getCenter(x: number, y: number): Canvas.PointArray;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#getSnappedPosition is deprecated. Use canvas.grid.getCenterPoint instead."`
     */
    getSnappedPosition(
      x: number,
      y: number,
      interval?: number,
      options?: NullishProps<{
        /**
         * The token
         */
        token: Token;
      }>,
    ): { x: number; y: number };

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"GridLayer#measureDistance is deprecated. "Use canvas.grid.measurePath instead for non-Euclidean measurements."`
     */
    measureDistance(
      origin: {
        x: number;
        y: number;
      },
      target: {
        x: number;
        y: number;
      },
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      options?: GridLayer.MeasureDistancesOptions,
    ): number;
  }

  namespace GridLayer {
    type AnyConstructor = typeof AnyGridLayer;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}

    interface LayerOptions extends CanvasLayer.LayerOptions {
      name: "grid";
    }

    interface HighlightPositionOptions {
      /**
       * The x-coordinate of the highlighted position
       * @remarks Required if `canvas.grid !== CONST.GRID_TYPES.GRIDLESS`
       */
      x?: number | undefined | null;

      /**
       * The y-coordinate of the highlighted position
       * @remarks Required if `canvas.grid !== CONST.GRID_TYPES.GRIDLESS`
       */
      y?: number | undefined | null;

      /**
       * The fill color of the highlight
       * @defaultValue `0x33BBFF`
       * @privateRemarks `null` is a problem because it's forwarded to a PIXI.Graphics#beginFill call which has a default value set
       */
      color?: PIXI.ColorSource | undefined;

      /**
       * The border color of the highlight
       * @defaultValue `null`
       */
      border?: PIXI.ColorSource | undefined | null;

      /**
       * The opacity of the highlight
       * @defaultValue `0.25`
       */
      alpha?: number | undefined;

      /**
       * A predefined shape to highlight
       * @defaultValue `null`
       */
      shape?: PIXI.Polygon | undefined | null;
    }

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks Used by {@link foundry.grid.BaseGrid#measureDistances}
     */
    interface Segment {
      ray: Ray;
      label?: Ruler["labels"]["children"][number];
    }

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks Used by {@link foundry.grid.BaseGrid#measureDistances}
     */
    type MeasureDistancesOptions = NullishProps<{
      /** Return the distance in grid increments rather than the co-ordinate distance. */
      gridSpaces?: boolean;
    }>;
  }
}

declare abstract class AnyGridLayer extends GridLayer {
  constructor(arg0: never, ...args: never[]);
}
