import type { HandleEmptyObject, Identity } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";
import type DataModel from "#common/abstract/data.d.mts";

declare global {
  /**
   * The Region Container.
   */
  class RegionLayer extends PlaceablesLayer<"Region"> {
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

    override get hookName(): "RegionLayer";

    /** The RegionLegend application of this RegionLayer */
    get legend(): foundry.applications.ui.RegionLegend;

    /**
     * Draw shapes as holes?
     * @defaultValue `false`
     * @remarks Foundry marked `@internal` but gets *and* sets it via the "hole" layer control toggle.
     * Leaving public as this seems to be the source of truth for that.
     */
    _holeMode: boolean;

    protected override _activate(): void;

    protected override _deactivate(): void;

    override storeHistory<Operation extends Document.Database.Operation>(
      type: Operation,
      data: PlaceablesLayer.HistoryDataFor<Operation, "Region">,
    ): void;

    /** @remarks Core overrides this returning an empty array to prevent copy & paste behavior. */
    override copyObjects(): [];

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    override getZIndex(): number;

    protected override _draw(options: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<void>;

    /**
     * Highlight the shape or clear the highlight.
     * @param data - The shape to highlight, or null to clear the highlight
     * @remarks Foundry marked `@internal`. If `data` is falsey, clears the current highly and returns early
     */
    protected _highlightShape(data?: DataModel.ConstructorDataFor<foundry.data.BaseShapeData> | null): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    protected override _canDragLeftStart(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;
  }

  namespace RegionLayer {
    interface Any extends AnyRegionLayer {}
    interface AnyConstructor extends Identity<typeof AnyRegionLayer> {}

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<Region.ImplementationClass> {
      name: "regions";
      controllableObjects: true;
      confirmDeleteKey: true;
      quadtree: false;
      zIndex: 100;
      zIndexActive: 600;
    }
  }
}

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(...args: never);
}
