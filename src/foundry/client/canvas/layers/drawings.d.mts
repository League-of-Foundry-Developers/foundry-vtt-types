import type { AnyMutableObject, FixedInstanceType, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type PlaceablesLayer from "./base/placeables-layer.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";
import type { DrawingPalette } from "#client/applications/sheets/palette/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      DrawingsLayer: DrawingsLayer.Implementation;
    }
  }
}

/**
 * The DrawingsLayer subclass of PlaceablesLayer.
 * This layer implements a container for drawings.
 */
declare class DrawingsLayer extends ShapeLayerMixin(PlaceablesLayer<"Drawing">) {
  // Fake type override
  static get instance(): Canvas["drawings"];

  // Fake type override
  override options: DrawingsLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   name: "drawings",
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   zIndex: 500,
   *   allowedEmptyShapes: ["polygon"],
   *   discardClosingPoint: false
   * })
   * ```
   */
  static override get layerOptions(): DrawingsLayer.LayerOptions;

  static override documentName: "Drawing";

  static override paletteClass: typeof DrawingPalette;

  /**
   * The collection of drawing objects which are rendered in the interface.
   */
  graphics: Collection<Drawing.Implementation>;

  override get hud(): NonNullable<Canvas["hud"]>["drawing"];

  override get hookName(): "DrawingsLayer";

  override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Drawing.Implementation[];

  protected override _deactivate(): void;

  // fake type override
  override draw(options?: HandleEmptyObject<DrawingsLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<DrawingsLayer.DrawOptions>): Promise<void>;

  /**
   * Get initial data for a new drawing.
   * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
   * @param origin - The initial coordinate
   * @returns The new drawing data
   */
  protected _getNewDrawingData(origin: Canvas.Point): DrawingDocument.CreateData;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): DrawingDocument.CreateData;

  /**
   * @remarks
   * @throws If {@linkcode game.activeTool} is not one of the drawing creation tools.
   */
  protected override _createDragShapeData(event: Canvas.Event.Pointer): AnyMutableObject;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _updateMouseWheelPreview(): void;
}

declare namespace DrawingsLayer {
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
    interface Any extends AnyDrawingsLayer {}
    interface AnyConstructor extends Identity<typeof AnyDrawingsLayer> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.layers.drawings.layerClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<Drawing.ImplementationClass> {
    name: "drawings";
    controllableObjects: true;
    rotatableObjects: true;

    /** @defaultValue `500` */
    zIndex: number;

    /** @defaultValue `["polygon"]` */
    allowedEmptyShapes: string[];

    discardClosingPoint: false;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  // `DrawingsLayer` has no `_tearDown` override, this exists for consistency.
  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}
}

export default DrawingsLayer;

declare abstract class AnyDrawingsLayer extends DrawingsLayer {
  constructor(...args: never);
}
