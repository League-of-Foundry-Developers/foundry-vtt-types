import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasDepthMask, PlaceablesLayer } from "./_module.d.mts";
import type { Tile } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TilesLayer: TilesLayer.Implementation;
    }
  }
}

/**
 * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
 */
declare class TilesLayer extends PlaceablesLayer<"Tile"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["tiles"];

  static override documentName: "Tile";

  override options: TilesLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *    name: "tiles",
   *    zIndex: 300,
   *    controllableObjects: true,
   *    rotatableObjects: true,
   * })
   * ```
   */
  static override get layerOptions(): TilesLayer.LayerOptions;

  override get hookName(): "TilesLayer";

  override get hud(): NonNullable<Canvas["hud"]>["tile"];

  /**
   * An array of Tile objects which are rendered within the objects container
   */
  get tiles(): Tile.Implementation[];

  /**
   * @remarks Only produces foreground or non-foreground tiles, depending on the state
   * of the foreground layer toggle control
   */
  override controllableObjects(): Generator<Tile.Implementation, void, undefined>;

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _tearDown(options: AnyObject): Promise<void>;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle drop events for Tile data on the Tiles Layer
   * @param event - The concluding drag event
   * @param data  - The extracted Tile data
   */
  protected _onDropData(
    event: DragEvent,
    data: TilesLayer.DropData,
  ): Promise<TileDocument.Implementation | false | void>;

  /**
   * Prepare the data object when a new Tile is dropped onto the canvas
   * @param event - The concluding drag event
   * @param data  - The extracted Tile data
   * @returns The prepared data to create
   */
  protected _getDropData(event: DragEvent, data: TilesLayer.DropData): Promise<TileDocument.CreateData>;

  /**
   * Get an array of overhead Tile objects which are roofs
   * @deprecated "`TilesLayer#roofs` has been deprecated without replacement." (since v12, until v14)
   */
  get roofs(): Tile.Implementation[];

  /**
   * A convenience reference to the tile occlusion mask on the primary canvas group.
   * @deprecated "`TilesLayer#depthMask` is deprecated without replacement. Use {@linkcode Canvas.masks | canvas.masks.depth} instead" (since v12, until v14)
   */
  get depthMask(): CanvasDepthMask.Any;
}

declare namespace TilesLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyTilesLayer {}
    interface AnyConstructor extends Identity<typeof AnyTilesLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["tiles"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Tile.ImplementationClass> {
    name: "tiles";
    zIndex: 300;
    controllableObjects: true;
    rotatableObjects: true;
  }

  /** @internal  */
  type _DropData = Required<Pick<TileDocument.CreateData, "elevation" | "height" | "width" | "sort">>;

  interface DropData extends Canvas.DropPosition, _DropData {
    type: "Tile";
    fromFilePicker: boolean;
    tileSize: number;
    texture: { src: string };
    occlusion: { mode: foundry.CONST.OCCLUSION_MODES };
  }
}

export default TilesLayer;

declare abstract class AnyTilesLayer extends TilesLayer {
  constructor(...args: never);
}
