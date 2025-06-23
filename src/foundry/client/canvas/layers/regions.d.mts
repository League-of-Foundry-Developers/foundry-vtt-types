import type { HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Region } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      RegionLayer: RegionLayer.Any;
    }
  }
}

/**
 * The Region Container.
 */
declare class RegionLayer extends PlaceablesLayer<"Region"> {
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
  protected _highlightShape(data?: foundry.data.BaseShapeData.CreateData | null): void;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;
}

declare namespace RegionLayer {
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

export default RegionLayer;

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(...args: never);
}
