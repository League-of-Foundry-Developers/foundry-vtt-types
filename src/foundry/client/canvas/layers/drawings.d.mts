import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      DrawingsLayer: DrawingsLayer.Implementation;
    }
  }
}

/**
 * The DrawingsLayer subclass of PlaceablesLayer.
 */
declare class DrawingsLayer extends PlaceablesLayer<"Drawing"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["drawings"];

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: DrawingsLayer.LayerOptions;

  /**
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   name: "drawings"
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   zIndex: 500
   * })
   * ```
   */
  static override get layerOptions(): DrawingsLayer.LayerOptions;

  static override documentName: "Drawing";

  /**
   * The named game setting which persists default drawing configuration for the User
   */
  static DEFAULT_CONFIG_SETTING: "defaultDrawingConfig";

  /**
   * The collection of drawing objects which are rendered in the interface.
   */
  graphics: Collection<Drawing.Implementation>;

  override get hud(): NonNullable<Canvas["hud"]>["drawing"];

  override get hookName(): "DrawingsLayer";

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  /**
   * Render a configuration sheet to configure the default Drawing settings
   */
  configureDefault(): void;

  protected override _deactivate(): void;

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Get initial data for a new drawing.
   * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
   * @param origin - The initial coordinate
   * @returns The new drawing data
   * @privateRemarks This isn't called externally (anymore?) but seems too useful to make protected without any indication on Foundry's side of such intent
   */
  _getNewDrawingData(origin: Canvas.Point): DrawingDocument.CreateData;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  /**
   * @throws A `DataModelValidationError` if document creation fails
   */
  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Handling of mouse-up events which conclude a new object creation after dragging
   * @private
   */
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Use an adaptive precision depending on the size of the grid
   * @deprecated since v12 until v14
   */
  get gridPrecision(): 0 | 8 | 16;
}

declare namespace DrawingsLayer {
  interface Any extends AnyDrawingsLayer {}
  interface AnyConstructor extends Identity<typeof AnyDrawingsLayer> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["drawings"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Drawing.ImplementationClass> {
    name: "drawings";
    controllableObjects: true;
    rotatableObjects: true;
    zIndex: 500;
  }
}

export default DrawingsLayer;

declare abstract class AnyDrawingsLayer extends DrawingsLayer {
  constructor(...args: never);
}
