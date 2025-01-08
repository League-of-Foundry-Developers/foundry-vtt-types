import type { EmptyObject } from "../../../../../utils/index.d.mts";

declare global {
  /**
   * The Region Container.
   */
  class RegionLayer<
    DrawOptions extends RegionLayer.DrawOptions = RegionLayer.DrawOptions,
    TearDownOptions extends PlaceablesLayer.TearDownOptions = PlaceablesLayer.TearDownOptions,
  > extends PlaceablesLayer<"Region", DrawOptions, TearDownOptions> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["regions"];

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "regions",
     *  controllableObjects: true,
     *  confirmDeleteKey: true,
     *  quadtree: false,
     *  zIndex: 100,
     *  zIndexActive: 600
     * })
     * ```
     */
    static override get layerOptions(): RegionLayer.LayerOptions;

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: RegionLayer.LayerOptions;

    static override documentName: "Region";

    /** The method to sort the Regions. */
    static #sortRegions: () => void;

    override get hookName(): string;

    /** The RegionLegend application of this RegionLayer */
    get legend(): foundry.applications.ui.RegionLegend;
    #legend: foundry.applications.ui.RegionLegend | undefined;

    /** The graphics used to draw the highlighted shape. */
    #highlight: PIXI.Graphics | undefined;

    /** The graphics used to draw the preview of the shape that is drawn. */
    #preview: PIXI.Graphics | undefined;

    /**
     * Draw shapes as holes?
     * @defaultValue `false`
     * @internal
     */
    _holeMode: boolean

    protected override _activate(): void;
    
    protected override _deactivate(): void;

    override storeHistory(type: PlaceablesLayer.HistoryEventType, data: EmptyObject[]): void;

    /** @remarks Prevent copy & paste */
    override copyObjects(): never[];

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    override getZIndex(): number;

    protected override _draw(options?: DrawOptions | undefined): Promise<void>;

    /**
     * Highlight the shape or clear the highlight.
     * @param data    - The shape to highlight, or null to clear the highlight
     * @internal
     */
    _highlightShape(data: foundry.data.BaseShapeData | null): void;

    /** Refresh the preview shape. */
    #refreshPreview(event: PIXI.FederatedEvent): void;

    /** Draw the preview shape. */
    #drawPreviewShape(event: PIXI.FederatedEvent): void;

    /** Create the shape data. */
    #createShapeData(event: PIXI.FederatedEvent): object | void;

    /** Create the rectangle shape data */
    #createRectangleData(event: PIXI.FederatedEvent): object | void;

    /** Create the circle or ellipse shape data */
    #createCircleOrEllipseData(event: PIXI.FederatedEvent): object | void;

    /** Create the polygon shape data */
    #createPolygonData(event: PIXI.FederatedEvent): object | void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _canDragLeftStart(user: User.ConfiguredInstance, event: PIXI.FederatedEvent): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;
  }

  namespace RegionLayer {
    type AnyConstructor = typeof AnyRegionLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Region"> {}
  }
}

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(arg0: never, ...args: never[]);
}