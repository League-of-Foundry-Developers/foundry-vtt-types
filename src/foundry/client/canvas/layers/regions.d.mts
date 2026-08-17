import type { FixedInstanceType, HandleEmptyObject, Identity, InexactPartial, MaybePromise } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type PlaceablesLayer from "./base/placeables-layer.d.mts";
import type TokenLayer from "./tokens.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";
import type { RegionPalette } from "#client/applications/sheets/palette/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      RegionLayer: RegionLayer.Implementation;
    }
  }
}

/**
 * The Regions Container.
 */
declare class RegionLayer extends ShapeLayerMixin(PlaceablesLayer<"Region">) {
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

  static override paletteClass: typeof RegionPalette;

  override get hookName(): "RegionLayer";

  /**
   * The highlight meshes of the Regions.
   * @internal
   */
  _highlights: PIXI.Container;

  /**
   * The shape clipboard.
   * @defaultValue `{ shape: null, cut: false }`
   * @internal
   */
  _shapeClipboard: RegionLayer.ShapeClipboard;

  /**
   * The placement context.
   * @defaultValue `null`
   * @internal
   */
  _placementContext: RegionLayer.PlacementContext | null;

  /**
   * Is Measured Template Mode enabled?
   * @defaultValue `!game.user.isGM`
   */
  get templateMode(): boolean;

  set templateMode(value);

  /**
   * Is the palette toggle visible?
   * @defaultValue `!this.templateMode`
   * @internal
   */
  _togglePaletteVisible: boolean;

  protected override _deactivate(): void;

  override storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Region">[],
    options?: PlaceablesLayer.HistoryEntry<"Region">["options"],
  ): void;

  override copyObjects(options?: PlaceablesLayer.CopyObjectsOptions): Region.Implementation[];

  override getZIndex(): number;

  // fake type override
  override draw(options?: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: RegionLayer.TearDownOptions): Promise<this>;

  protected override _tearDown(options: RegionLayer.TearDownOptions): Promise<void>;

  /**
   * Highlight the shape or clear the highlight.
   * @param shape - The shape to highlight, or null to clear the highlight
   * @internal
   * @remarks If `shape` is falsey, clears the current highlight and returns early
   */
  _highlightShape(shape?: BaseShapeData | null): void;

  static override prepareSceneControls(): SceneControls.Control;

  /**
   * Place a Region at the cursor.
   * The Region can have multiple shapes but must have at least one.
   * Each shape is placed one after the other in the given order.
   * Only one Region can be placed at a time.
   * The placed Region shapes can be rotated with the mouse wheel unless `allowRotation` is false.
   * Left-click confirms the placement of a shape. Right-click skips the placement of a shape.
   * The Region layer is activated unless the Token layer is active.
   * @param data    - The data of the Region to place
   * @param options - Additional options
   * @returns The Region document that was placed or null if
   * - the placements of all shapes were skipped unless `allowEmpty` is true,
   * - the dismiss key was pressed,
   * - the placement was rejected by `preCommit`,
   * - the game was paused, the user is not a GM, and the `create` option is true, or
   * - the Region creation was rejected by preCreate.
   *
   * @example Attach a 10-foot emanation to a token.
   * ```js
   * await canvas.regions.placeRegion({
   *   name: "Aura",
   *   shapes: [{
   *     type: "emanation",
   *     base: {type: "token", x: 0, y: 0, width: 1, height: 1, shape: CONST.TOKEN_SHAPES.RECTANGLE_1},
   *     radius: 10 * canvas.dimensions.distancePixels,
   *     gridBased: true
   *   }],
   *   color: game.user.color,
   *   restriction: {enabled: true},
   *   levels: [canvas.level.id],
   *   highlightMode: "coverage",
   *   displayMeasurements: true,
   *   visibility: CONST.REGION_VISIBILITY.ALWAYS,
   *   ownership: {[game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER}
   * }, {attachToToken: true});
   * ```
   *
   * @remarks
   * @throws If any of the callback options is provided and is not a function, or if the canvas is not ready.
   */
  placeRegion(
    data: RegionDocument.CreateData,
    options?: RegionLayer.PlacementOptions,
  ): Promise<RegionDocument.Implementation | null>;

  /**
   * Place multiple Regions at the cursor one after the other.
   * @param data    - The data of the Regions to place
   * @param options - Additional options
   * @returns The Region documents that were placed, or null if the placement was cancelled
   *
   * @remarks
   * @throws If `data` is empty, or if `preCommit` is provided and is not a function.
   */
  placeRegions(
    data: Iterable<RegionDocument.CreateData>,
    options?: RegionLayer.PlaceRegionsOptions,
  ): Promise<RegionDocument.Implementation[] | null>;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): RegionDocument.CreateData;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _onDeleteKey(event: KeyboardEvent): boolean;

  protected override _onCutKey(event: KeyboardEvent): boolean;

  protected override _onCopyKey(event: KeyboardEvent): boolean;

  protected override _onPasteKey(event: KeyboardEvent): boolean;

  protected override _onMouseWheel(event: Canvas.Event.Wheel): void;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  /**
   * Cancel the placement.
   * @internal
   */
  _cancelPlacement(): void;

  protected override _confirmDeleteKey(documents: RegionDocument.Implementation[]): Promise<DialogV2.ConfirmReturn>;

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

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<Region.ImplementationClass> {
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

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface ShapeClipboard {
    /** @remarks The copied or cut shape, `null` when the clipboard is empty */
    shape: BaseShapeData | null;

    /** @remarks Was {@linkcode shape} populated by a cut, rather than a copy? */
    cut: boolean;
  }

  /**
   * @remarks The shape-level position of the shape a placement callback is being invoked for.
   */
  interface PlacementProgress {
    /** The index of the Region being placed */
    regionIndex: number;

    /** The number of Regions being placed */
    regionCount: number;

    /** The shape currently being placed */
    shape: BaseShapeData;

    /** The index of {@linkcode shape} within the Region's shapes */
    shapeIndex: number;

    /** The number of shapes of the Region being placed */
    shapeCount: number;
  }

  /** @internal */
  interface _PlacementCallbackArgs extends PlacementProgress {
    preview: Region.Implementation;
    document: RegionDocument.Implementation;
  }

  interface OnMoveArgs extends _PlacementCallbackArgs {
    event: PIXI.FederatedEvent;
    position: Canvas.Point;
    snap: boolean;
  }

  interface OnRotateArgs extends _PlacementCallbackArgs {
    event: Canvas.Event.Wheel;
    precise: boolean;
  }

  interface OnChangeArgs extends _PlacementCallbackArgs {}

  interface PreConfirmArgs extends PlacementProgress {
    event: PIXI.FederatedEvent;
    document: RegionDocument.Implementation;
  }

  interface PreSkipArgs extends PreConfirmArgs {}

  /** @internal */
  interface _PlacementOptions {
    /**
     * Create the Region? If false, the preview document is returned.
     * @defaultValue `true`
     * @remarks Non-GMs cannot create Regions while the game is paused.
     */
    create: boolean;

    /**
     * Optional creation options.
     * @defaultValue `{}`
     * @remarks By default the creation option `controlObject` is true.
     */
    createOptions: RegionLayer.CreateOptions;

    /**
     * Allow rotation of the Region?
     * @defaultValue `true`
     */
    allowRotation: boolean;

    /**
     * Create/return an empty Region if all shapes are skipped?
     * @defaultValue `false`
     */
    allowEmpty: boolean;

    /**
     * Attach the Region to Tokens? If true, the Region is attached to the hovered Token and the initial elevation
     * range passed in `data` is relative to that Token. The Region is placed unattached if no Token is hovered:
     * check `document.attachment.token` in `preConfirm` and return false to require an attachment.
     * @defaultValue `false`
     */
    attachToToken: boolean;
  }

  interface PlacementOptions extends InexactPartial<_PlacementOptions> {
    /**
     * Called when the pointer is moved and after starting the placement of the next shape on confirm and skip. This
     * callback replaces the default behavior if false is returned. If false is returned, the callback should modify
     * the passed `shape` and may additionally modify `preview.document` and set the render flags on `preview`
     * corresponding to the applied changes.
     */
    onMove?: ((args: OnMoveArgs) => boolean | void) | undefined;

    /**
     * Called when the mouse wheel is scrolled. This callback replaces the default behavior if false is returned.
     * If false is returned, the callback should modify the `shape` and may additionally modify `preview.document`
     * and set the render flags on `preview` corresponding to the applied changes.
     */
    onRotate?: ((args: OnRotateArgs) => boolean | void) | undefined;

    /** Called when the Region shape that is placed has changed. */
    onChange?: ((args: OnChangeArgs) => void) | undefined;

    /**
     * Called before the confirmation (left-click) of a shape placement. This callback may return false to prevent
     * the placement of the Region shape and display a warning.
     */
    preConfirm?: ((args: PreConfirmArgs) => boolean | void) | undefined;

    /**
     * Called before skipping (right-click) of a shape placement. This callback may return false to prevent
     * skipping of the Region shape and display a warning.
     */
    preSkip?: ((args: PreSkipArgs) => boolean | void) | undefined;

    /**
     * Called at the end of the workflow before the Region documents are created/returned. This callback may return
     * a falsely value other than undefined to prevent the Regions from being created/returned.
     */
    preCommit?: ((documents: readonly RegionDocument.Implementation[]) => MaybePromise<void>) | undefined;
  }

  interface PlaceRegionsOptions extends PlacementOptions {}

  /**
   * @remarks Forwarded to {@linkcode Scene.createEmbeddedDocuments | Scene#createEmbeddedDocuments}; `parent` is
   * always supplied by the layer.
   */
  interface CreateOptions extends Omit<
    RegionDocument.Database.CreateOperation,
    "parent" | "data" | "modifiedTime" | "render"
  > {}

  /**
   * @remarks The in-progress state of a {@linkcode RegionLayer.placeRegion | RegionLayer#placeRegion} workflow.
   */
  interface PlacementContext extends _PlacementOptions {
    data: RegionDocument.CreateData;
    layer: RegionLayer.Implementation | TokenLayer.Implementation;
    regionIndex: number;
    regionCount: number;
    preview: Region.Implementation;
    shapes: BaseShapeData[];
    shape: BaseShapeData;
    destroyPreview: boolean;
    resolve: (document: RegionDocument.Implementation | null) => void;
    reject: (error: Error) => void;
    onMove: PlacementOptions["onMove"];
    onRotate: PlacementOptions["onRotate"];
    onChange: PlacementOptions["onChange"];
    preConfirm: PlacementOptions["preConfirm"];
    preSkip: PlacementOptions["preSkip"];
    preCommit: PlacementOptions["preCommit"];

    /** @remarks Set true after the "rotation not allowed" warning has been shown once for this placement */
    rotationNotification: boolean;
  }
}

export default RegionLayer;

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(...args: never);
}
