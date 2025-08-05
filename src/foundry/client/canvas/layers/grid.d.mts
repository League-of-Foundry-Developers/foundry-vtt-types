import type { EmptyObject, AnyObject, Identity, NullishProps, RemoveIndexSignatures } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { GridShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { GridMesh, GridHighlight } from "#client/canvas/containers/_module.d.mts";
import type { CanvasLayer } from "#client/canvas/layers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      GridLayer: GridLayer.Any;
    }
  }
}

/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer {
  /**
   * @remarks Due to the grid rework in v12 this points to a BaseGrid subclass rather than a GridLayer instance,
   *          however to avoid inheritance-based issues this is left as the intended GridLayer instance
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): GridLayer;

  /**
   * The grid mesh.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  mesh: GridMesh | undefined;

  /**
   * The Grid Highlight container
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
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

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Creates the grid mesh.
   */
  protected _drawMesh(): GridMesh;

  /**
   * Initialize the grid mesh appearance and configure the grid shader.
   * @remarks All the properties of `options` are optional, but it lacks an `={}` default so an object must be passed, even if empty
   */
  initializeMesh(options: GridLayer.InitializeMeshOptions): void;

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
   * @remarks Despite being an `={}` parameter, `options` is required, as not providing `x` or `y` produces `NaN`s
   * or puts garbage data into the associated `GridHightlightLayer`, depending on the current grid type
   */
  highlightPosition(name: string, options: GridLayer.HighlightPositionOptions): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#type is deprecated. Use canvas.grid.type instead."
   */
  get type(): foundry.CONST.GRID_TYPES;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#size is deprecated. Use canvas.grid.size instead.
   */
  get size(): number;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#grid is deprecated. Use canvas.grid instead."
   */
  get grid(): Canvas["grid"];

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#isNeighbor is deprecated. Use canvas.grid.testAdjacency instead."
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#w is deprecated in favor of canvas.grid.sizeX."
   */
  get w(): number;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#h is deprecated in favor of canvas.grid.sizeY."
   */
  get h(): number;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#isHex is deprecated. Use canvas.grid.isHexagonal instead."
   */
  get isHex(): boolean;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#getTopLeft is deprecated. Use canvas.grid.getTopLeftPoint instead."
   */
  getTopLeft(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#getCenter is deprecated. Use canvas.grid.getCenterPoint instead."
   */
  getCenter(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "GridLayer#getSnappedPosition is deprecated. Use canvas.grid.getCenterPoint instead."
   */
  getSnappedPosition(
    x: number,
    y: number,

    /**
     * @defaultValue `1`
     * @remarks Can't be `null` due to being used directly as a divisor
     */
    interval?: number,

    /** @remarks Unused */
    options?: EmptyObject | null,
  ): PIXI.IPointData;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"GridLayer#measureDistance is deprecated. "Use canvas.grid.measurePath instead for non-Euclidean measurements."`
   */
  measureDistance(
    origin: Canvas.Point,
    target: Canvas.Point,

    /** @remarks Unused */
    options?: EmptyObject | null,
  ): number;
}

declare namespace GridLayer {
  interface Any extends AnyGridLayer {}
  interface AnyConstructor extends Identity<typeof AnyGridLayer> {}

  interface LayerOptions extends CanvasLayer.LayerOptions {
    name: "grid";
  }

  /** @internal */
  type _InitializeMeshOptions = NullishProps<{
    /** The grid style */
    style: ConfiguredGridStyles;
  }>;

  interface InitializeMeshOptions
    extends _InitializeMeshOptions,
      Pick<GridMesh.InitializationMeshData, "thickness" | "color" | "alpha"> {}

  /** @internal */
  type _HighlightPositionOptions = NullishProps<{
    /**
     * @defaultValue `0x33BBFF`
     * @remarks This value eventually ends up at `PIXI.Graphics#normalizeColor()`, which handles `null` as `0` (black)
     */
    color: PIXI.ColorSource | Color;

    /**
     * The border color of the highlight
     * @defaultValue `null`
     * @remarks If `null`, no border will be drawn.
     */
    border: PIXI.ColorSource | Color;

    /**
     * The opacity of the highlight
     * @defaultValue `0.25`
     * @remarks The above is only a parameter default; `PIXI.Graphics#normalizeColor()` will replace `null` with `1`
     */
    alpha: number;

    /**
     * A predefined shape to highlight
     * @defaultValue `null`
     * @remarks Must be provided on gridless scenes or highlighting will fail quietly
     */
    shape: PIXI.IShape;
  }>;

  interface HighlightPositionOptions extends _HighlightPositionOptions {
    /**
     * The x-coordinate of the highlighted position
     * @remarks Required despite Foundry marking it optional. If omitted on gridless will produce `NaN`s,
     * and on other grid types will insert garbage data into the associated `GridHighlightLayer`
     */
    x: number;

    /**
     * The y-coordinate of the highlighted position
     * @remarks Required despite Foundry marking it optional. If omitted on gridless will produce `NaN`s,
     * and on other grid types will insert garbage data into the associated `GridHighlightLayer`
     */
    y: number;
  }

  /** @internal */
  type _GridStyle = NullishProps<{
    /** @defaultValue `GridShader` */
    shaderClass: GridShader.AnyConstructor;

    /** @defaultValue `{}` */
    shaderOptions: NullishProps<{
      /**
       * @defaultValue `0`
       * @remarks Gets applied to the constructed shaderClass instance's `uniforms`.
       *
       * @privateRemarks It's unclear if this is actually representing an enum value or not, so it's been left as `number`.
       */
      style: number;
    }>;
  }>;

  interface GridStyle extends _GridStyle {
    /** @remarks A localization key to display in the Configure Scene sheet */
    label: string;
  }

  type ConfiguredGridStyles = keyof RemoveIndexSignatures<CONFIG["Canvas"]["gridStyles"]>;
}

export default GridLayer;

declare abstract class AnyGridLayer extends GridLayer {
  constructor(...args: never);
}
