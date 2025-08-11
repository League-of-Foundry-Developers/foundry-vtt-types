import type {
  EmptyObject,
  AnyObject,
  Identity,
  NullishProps,
  RemoveIndexSignatures,
  FixedInstanceType,
  InexactPartial,
} from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { GridShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { GridMesh, GridHighlight } from "#client/canvas/containers/_module.d.mts";
import type { CanvasLayer } from "#client/canvas/layers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      GridLayer: GridLayer.Implementation;
    }
  }
}

/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer {
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

  /**
   * @remarks This override returns `canvas.interface.grid`, working around the fact that {@linkcode Canvas.grid | canvas.grid}
   * is a {@linkcode foundry.grid.BaseGrid} subclass
   */
  static get instance(): GridLayer.Implementation;

  /** @privateRemarks Fake type override */
  override options: GridLayer.LayerOptions;

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Creates the grid mesh.
   */
  protected _drawMesh(): GridMesh;

  /**
   * Initialize the grid mesh appearance and configure the grid shader.
   */
  initializeMesh(options?: GridLayer.InitializeMeshOptions): void;

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
   * @param name - The name for the referenced highlight layer
   * @remarks See {@linkcode GridLayer.HighlightPositionOptionsGrided} remarks
   */
  highlightPosition(name: string, options: GridLayer.HighlightPositionOptionsGrided): void;

  /**
   * Add highlighting for a specific grid position to a named highlight graphic
   * @param name - The name for the referenced highlight layer
   * @remarks See {@linkcode GridLayer.HighlightPositionOptionsGridless} remarks
   */
  highlightPosition(name: string, options: GridLayer.HighlightPositionOptionsGridless): void;

  /**
   * @deprecated "`GridLayer#type` is deprecated. Use {@linkcode foundry.grid.BaseGrid.type | canvas.grid.type} instead." (since v12, until v14)
   */
  get type(): CONST.GRID_TYPES;

  /**
   * @deprecated "`GridLayer#size` is deprecated. Use {@linkcode foundry.grid.BaseGrid.size | canvas.grid.type} instead." (since v12, until v14)
   */
  get size(): number;

  /**
   * @deprecated "`GridLayer#grid` is deprecated. Use {@linkcode foundry.canvas.Canvas.grid | canvas.grid} instead." (since v12, until v14)
   */
  get grid(): Canvas["grid"];

  /**
   * @deprecated "`GridLayer#isNeighbor` is deprecated. Use {@linkcode foundry.grid.BaseGrid.testAdjacency | canvas.grid.testAdjacency} instead." (since v12, until v14)
   */
  isNeighbor(r0: number, c0: number, r1: number, c1: number): boolean;

  /**
   * @deprecated "`GridLayer#w` is deprecated. Use {@linkcode foundry.grid.BaseGrid.sizeX | canvas.grid.sizeX} instead." (since v12, until v14)
   */
  get w(): number;

  /**
   * @deprecated "`GridLayer#h` is deprecated. Use {@linkcode foundry.grid.BaseGrid.sizeY | canvas.grid.sizeY} instead." (since v12, until v14)
   */
  get h(): number;

  /**
   * @deprecated "`GridLayer#isHex` is deprecated. Use {@linkcode foundry.grid.BaseGrid.isHexagonal | canvas.grid.isHexagonal} instead." (since v12, until v14)
   */
  get isHex(): boolean;

  /**
   * @deprecated "`GridLayer#getTopLeft` is deprecated. Use {@linkcode foundry.grid.BaseGrid.getTopLeft | canvas.grid.getTopLeft} instead." (since v12, until v14)
   */
  getTopLeft(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated "`GridLayer#getCenter` is deprecated. Use {@linkcode foundry.grid.BaseGrid.getCenterPoint | canvas.grid.getCenterPoint} instead." (since v12, until v14)
   */
  getCenter(x: number, y: number): Canvas.PointTuple;

  /**
   * @deprecated "`GridLayer#getSnappedPosition` is deprecated. Use {@linkcode foundry.grid.BaseGrid.getSnappedPoint | canvas.grid.getSnappedPoint} instead." (since v12, until v14)
   */
  getSnappedPosition(
    x: number,
    y: number,

    /** @defaultValue `1` */
    interval?: number,

    /** @remarks Unused */
    options?: AnyObject,
  ): PIXI.IPointData;

  /**
   * @deprecated (since v12, until v14)
   * @remarks "`GridLayer#measureDistance` is deprecated. Use {@linkcode foundry.grid.BaseGrid.measurePath | canvas.grid.measurePath} instead, which returns grid distance (gridSpaces: true) and Euclidean distance (gridSpaces: false)."
   */
  measureDistance(
    origin: Canvas.Point,
    target: Canvas.Point,

    /** @remarks Unused */
    options?: EmptyObject | null,
  ): number;
}

declare namespace GridLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyGridLayer {}
    interface AnyConstructor extends Identity<typeof AnyGridLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["grid"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends CanvasLayer.LayerOptions {
    name: "grid";
  }

  /** @internal */
  type _InitializeMeshOptions = InexactPartial<{
    /** The grid style */
    style: ConfiguredGridStyles;
  }>;

  interface InitializeMeshOptions
    extends _InitializeMeshOptions,
      Pick<GridMesh.InitializationMeshData, "thickness" | "color" | "alpha"> {}

  /** @internal */
  type _HighlightPositionOptions = InexactPartial<{
    /**
     * @defaultValue `0x33BBFF`
     */
    color: PIXI.ColorSource | Color;

    /**
     * The border color of the highlight
     * @defaultValue `null`
     * @remarks If `null`, no border will be drawn.
     */
    border: PIXI.ColorSource | Color | null;

    /**
     * The opacity of the highlight
     * @defaultValue `0.25`
     */
    alpha: number;
  }>;

  /**
   * @remarks Options for highlighting a grid cell on a grided Scene: `x` and `y` required, `shape` always overridden so not included here.
   */
  interface HighlightPositionOptionsGrided extends _HighlightPositionOptions {
    /**
     * The x-coordinate of the highlighted position
     * @remarks Required on gridless scenes; `undefined` will produce `NaN`s and insert garbage data into the associated `GridHighlightLayer`
     */
    x: number;

    /**
     * The y-coordinate of the highlighted position
     * @remarks Required on gridless scenes; `undefined` will produce `NaN`s and insert garbage data into the associated `GridHighlightLayer`
     */
    y: number;
  }

  /** @remarks Options for highlighting an area on a gridless Scene: `shape` required, `x` and `y` unused so not included here  */
  interface HighlightPositionOptionsGridless extends _HighlightPositionOptions {
    /**
     * A predefined shape to highlight
     * @remarks Must be provided on gridless scenes or highlighting will fail quietly
     */
    shape: PIXI.IShape;
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
