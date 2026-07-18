import type { FixedInstanceType, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      RegionLayer: RegionLayer.Implementation;
    }
  }
}

/**
 * The Region Container.
 */
declare class RegionLayer extends PlaceablesLayer<"Region"> {
  // Fake type override
  static get instance(): Canvas["regions"];

  /**
   * @defaultValue
   * ```js
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

  // Fake type override
  override options: RegionLayer.LayerOptions;

  static override documentName: "Region";

  override get hookName(): "RegionLayer";

  /**
   * @deprecated Removed in v13, the source of truth for this is now `ui.controls.controls.regions.tools.hole.active`.
   * This warning will be removed in v14.
   */
  _holeMode: never;

  protected override _activate(): void;

  protected override _deactivate(): void;

  override storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Region">[],
    options?: PlaceablesLayer.HistoryEntry<"Region">["options"],
  ): void;

  /** @remarks Core overrides this returning an empty array to prevent copy & paste behavior. */
  override copyObjects(): [];

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  override getZIndex(): number;

  // fake type override
  override draw(options?: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<void>;

  /**
   * Highlight the shape or clear the highlight.
   * @param data - The shape to highlight, or null to clear the highlight
   * @internal
   * @remarks If `data` is falsey, clears the current highlight and returns early
   */
  _highlightShape(data?: foundry.data.BaseShapeData.CreateData | null): void;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  #RegionLayer: true;
}

declare namespace RegionLayer {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyRegionLayer {}
    interface AnyConstructor extends Identity<typeof AnyRegionLayer> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.layers.regions.layerClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Region.ImplementationClass> {
    name: "regions";
    controllableObjects: true;
    confirmDeleteKey: true;
    quadtree: false;

    /** @defaultValue `100` */
    zIndex: number;

    /** @defaultValue `600` */
    zIndexActive: number;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  // `RegionLayer` has no `_tearDown` override, this exists for consistency
  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}
}

export default RegionLayer;

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(...args: never);
}
