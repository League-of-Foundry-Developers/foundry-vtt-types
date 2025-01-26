import type { EmptyObject } from "fvtt-types/utils";

declare global {
  /**
   * The Region Container.
   */
  class RegionLayer<
    DrawOptions extends RegionLayer.DrawOptions = RegionLayer.DrawOptions,
    TearDownOptions extends PlaceablesLayer.TearDownOptions = PlaceablesLayer.TearDownOptions,
  > extends PlaceablesLayer<"Region", DrawOptions, TearDownOptions> {
    #regionLayer: true;

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

    override get hookName(): string;

    /** The RegionLegend application of this RegionLayer */
    get legend(): foundry.applications.ui.RegionLegend;

    /**
     * Draw shapes as holes?
     * @defaultValue `false`
     * @internal
     */
    protected _holeMode: boolean;

    protected override _activate(): void;

    protected override _deactivate(): void;

    override storeHistory(type: PlaceablesLayer.HistoryEventType, data: EmptyObject[]): void;

    /** @remarks Core overrides this returning an empty array to prevent copy & paste behavior. */
    override copyObjects(): [];

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    override getZIndex(): number;

    protected override _draw(options?: DrawOptions): Promise<void>;

    /**
     * Highlight the shape or clear the highlight.
     * @param data - The shape to highlight, or null to clear the highlight
     * @internal
     */
    protected _highlightShape(data?: foundry.data.BaseShapeData | null): void;

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
    type Any = AnyRegionLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Region"> {}
  }
}

declare abstract class AnyRegionLayer extends RegionLayer<RegionLayer.DrawOptions, PlaceablesLayer.TearDownOptions> {
  constructor(arg0: never, ...args: never[]);
}
