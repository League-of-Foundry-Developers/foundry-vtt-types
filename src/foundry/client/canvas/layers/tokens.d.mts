import type { FixedInstanceType, HandleEmptyObject, Identity, InexactPartial, MaybePromise } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { Notifications, SceneControls } from "#client/applications/ui/_module.d.mts";
import type { PIXI } from "#configuration";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TokenLayer: TokenLayer.Implementation;
    }
  }
}

/**
 * The Tokens Container.
 */
declare class TokenLayer extends PlaceablesLayer<"Token"> {
  constructor();

  /**
   * The ruler paths.
   * @internal
   * @remarks This Container's `eventMode` is set to `"none"`
   */
  _rulerPaths: PIXI.Container;

  /**
   * The current index position in the tab cycle
   * @defaultValue `null`
   * @internal
   */
  _tabIndex: number | null;

  /**
   * The Token that the drag workflow was initiated on, if there's a drag workflow in progress.
   * Set in {@linkcode Token._onDragLeftStart | Token#_onDragLeftStart} and {@linkcode Token._onDragLeftCancel | Token#_onDragLeftCancel}.
   * @defaultValue `null`
   * @internal
   */
  _draggedToken: Token.Implementation | null;

  /**
   * The currently selected movement action override.
   * @defaultValue `null`
   * @internal
   */
  _dragMovementAction: string | null;

  /**
   * The movement planning context.
   * @defaultValue `null`
   * @internal
   */
  _movementPlanningContext: TokenLayer.MovementPlanningContext | null;

  /**
   * The placement context.
   * @defaultValue `null`
   * @internal
   */
  _placementContext: TokenLayer.PlacementContext | null;

  // Fake type override
  static get instance(): Canvas["tokens"];

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "tokens",
   *  controllableObjects: true,
   *  rotatableObjects: true,
   *  keyboardMovableObjects: true,
   *  confirmDeleteKey: true
   *  zIndex: 200
   * })
   * ```
   */
  static override get layerOptions(): TokenLayer.LayerOptions;

  // Fake type override
  override options: TokenLayer.LayerOptions;

  static override documentName: "Token";

  /**
   * The set of tokens that trigger occlusion (a union of {@linkcode CONST.TOKEN_OCCLUSION_MODES}).
   */
  get occlusionMode(): CONST.TOKEN_OCCLUSION_MODES;

  set occlusionMode(value);

  override get hookName(): "TokenLayer";

  override get hud(): NonNullable<Canvas["hud"]>["token"];

  /**
   * An Array of tokens which belong to actors which are owned
   */
  get ownedTokens(): Token.Implementation[];

  /**
   * A Set of Token objects which currently display a combat turn marker.
   */
  turnMarkers: Set<Token.Implementation>;

  /** @remarks Forces top left corner snapping */
  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  override _prepareKeyboardMovementUpdates(
    objects: Token.Implementation[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): PlaceablesLayer.PreparedUpdates<"Token">;

  // fake type override
  override draw(options?: HandleEmptyObject<TokenLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<TokenLayer.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: TokenLayer.TearDownOptions): Promise<this>;

  protected override _tearDown(options: TokenLayer.TearDownOptions): Promise<void>;

  protected override _activate(): void;

  protected override _deactivate(): void;

  /**
   * Target all Token instances which fall within a coordinate rectangle.
   * @param rectangle - The selection rectangle.
   * @param options   - Additional options to configure targeting behaviour.
   * @returns The number of Token instances which were targeted.
   */
  targetObjects(rectangle: Canvas.Rectangle, options?: TokenLayer.TargetObjectsOptions): number;

  /**
   * Assign multiple token targets
   * @param targetIds - The array or set of Token IDs.
   * @param options   - Additional options to configure targeting behaviour.
   */
  setTargets(targetIds: Iterable<string>, options?: TokenLayer.SetTargetsOptions): void;

  /**
   * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
   * Tokens are currently sorted in order of their TokenID
   * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
   * @param reset    - Restart the cycle order back at the beginning?
   * @returns The Token object which was cycled to, or null
   * @remarks Neither parameter has a default, so a call with no arguments cycles backward without resetting.
   *
   * Also selects the returned token if any, and pans the camera to its center.
   */
  cycleTokens(forwards?: boolean, reset?: boolean): Token.Implementation | null;

  /**
   * Immediately conclude the animation of any/all tokens
   */
  concludeAnimation(): void;

  /**
   * Recalculate the planned movement paths of all Tokens for the current User.
   */
  recalculatePlannedMovementPaths(): void;

  /**
   * Handle broadcast planned movement update.
   * @param user             - The User the planned movement data belongs to
   * @param plannedMovements - The planned movement data
   * @internal
   */
  _updatePlannedMovements(
    user: User.Implementation,
    plannedMovements: Record<string, Token.PlannedMovement | null> | null,
  ): void;

  /**
   * Provide an array of Tokens which are eligible subjects for tile occlusion.
   * By default, only tokens which are currently controlled or owned by a player are included as subjects.
   */
  protected _getOccludableTokens(): Token.Implementation[];

  override _getMovableObjects(ids?: string[], includeLocked?: boolean): Token.Implementation[];

  override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Token.Implementation[];

  override storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Token">[],
    options?: PlaceablesLayer.HistoryEntry<"Token">["options"],
  ): void;

  protected override _onCycleViewKey(event: KeyboardEvent): boolean;

  protected override _confirmDeleteKey(documents: TokenDocument.Implementation[]): Promise<DialogV2.ConfirmReturn>;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _highlightObjects(active: boolean): void;

  /**
   * Place Tokens at the cursor.
   * Each Token is placed one after the other in the given order.
   * The placed Tokens can be rotated with the mouse wheel unless the `allowRotation` is false.
   * @param data    - The data of the Tokens to place
   * @param options - Additional options
   * @returns The Token documents that were placed and not rejected by preCreate.
   * @remarks If the dismiss key was pressed, the placement was rejected by `preCommit`, or the game was paused, the
   * user is not a GM, and the `create` option is true, an empty array is returned.
   * @example Place 3 tokens with random actor.
   * ```js
   * const {count: numTokensToSpawn=3} = await foundry.applications.api.DialogV2.input({
   *  window: {
   *     title: "How many tokens to you want to place?"
   *  },
   *  content: `<input type="number" name="count" min="0" step="1" value="3">`
   * }) ?? {};
   * const actors = game.actors.contents;
   * const tokensToPlace = [];
   * for ( let i = 0; i < numTokensToSpawn; i++ ) {
   *   const actor = actors[Math.floor(Math.random() * actors.length)];
   *   const token = await actor.getTokenDocument({level: canvas.level.id}, {parent: canvas.scene});
   *   tokensToPlace.push(token.toObject());
   * }
   * const placedTokens = await canvas.tokens.placeTokens(tokensToPlace);
   * ```
   */
  placeTokens(
    data: Iterable<Partial<Document.CreateDataForName<"Token">>>,
    options?: TokenLayer.PlaceTokensOptions,
  ): Promise<TokenDocument.Implementation[]>;

  /**
   * Handle dropping of ActiveEffect data onto a Token, creating a new ActiveEffect on the corresponding Actor.
   * @internal
   */
  _onDropActiveEffect(event: DragEvent, data: TokenLayer.DropActiveEffectData): Promise<void>;

  /**
   * Handle dropping of Actor data onto the Scene canvas
   * @internal
   */
  protected _onDropActorData(
    event: DragEvent,
    data: TokenLayer.DropData,
  ): Promise<ReturnType<Notifications["warn"]> | false | TokenDocument.Implementation>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _onClickRight2(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Token.Implementation[]> | void;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  /**
   * Cancel the placement.
   * @internal
   */
  _cancelPlacement(): void;

  /**
   * Cancel movement planning.
   * @internal
   */
  _cancelMovementPlanning(): void;

  #TokenLayer: true;
}

declare namespace TokenLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyTokenLayer {}
    interface AnyConstructor extends Identity<typeof AnyTokenLayer> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.layers.tokens.layerClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Token.ImplementationClass> {
    name: "tokens";
    controllableObjects: true;
    rotatableObjects: true;
    keyboardMovableObjects: true;
    confirmDeleteKey: true;

    /** @defaultValue `200` */
    zIndex: number;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  /** @remarks The waypoint data {@linkcode TokenLayer.storeHistory | TokenLayer#storeHistory} includes in movement-including update `undoOptions` */
  interface MovementUpdateHistoryWaypoint extends Pick<
    TokenDocument.MeasuredMovementWaypoint,
    keyof TokenDocument.Position | "action"
  > {}

  /**
   * @remarks See {@linkcode PlaceablesLayer.UpdateHistoryEntry.options} remarks.
   */
  interface MovementUpdateHistoryOptionsEntry {
    waypoints: MovementUpdateHistoryWaypoint[];
    method: "undo";
  }

  interface MovementUpdateHistoryUndoOptions {
    movement: Record<string, MovementUpdateHistoryOptionsEntry>;
  }

  interface DropData extends Canvas.DropPosition {
    type: "Actor";
    uuid: string;
    elevation?: number | undefined;
  }

  interface DropActiveEffectData extends Canvas.DropPosition {
    type: "ActiveEffect";
    uuid: string;
  }

  /** @internal */
  interface _TargetObjectsOptions {
    /**
     * Whether or not to release other targeted tokens
     * @defaultValue `true`
     */
    releaseOthers: boolean;
  }

  interface TargetObjectsOptions extends InexactPartial<_TargetObjectsOptions> {}

  type SetTargetMode = "replace" | "acquire" | "release";

  /** @internal */
  interface _SetTargetsOptions {
    /**
     * The mode that determines the targeting behavior.
     *   - `"replace"` (default): Replace the current set of targeted Tokens with provided set of Tokens.
     *   - `"acquire"`: Acquire the given Tokens as targets without releasing already targeted Tokens.
     *   - `"release"`: Release the given Tokens as targets.
     * @defaultValue `"replace"`
     */
    mode: SetTargetMode;
  }

  interface SetTargetsOptions extends InexactPartial<_SetTargetsOptions> {}

  interface MovementPlanningContext {
    object: Token.Implementation;
    allowedActions: string[] | null;
    direct: boolean;
    minCost: number;
    maxCost: number;
    minDistance: number;
    maxDistance: number;
    preventDrop: boolean;
    terrainOptions: Omit<Token.CreateTerrainMovementPathOptions, "preview">;
    constrainOptions: Omit<Token.ConstrainMovementPathOptions, "preview" | "history" | "measureOptions">;
    measureOptions: Omit<Token.MeasureMovementPathOptions, "preview">;
    pathfindingOptions: Omit<
      Token.FindMovementPathOptions,
      "preview" | "terrainOptions" | "constrainOptions" | "measureOptions"
    >;
    moveOptions: Omit<
      TokenDocument.MoveOptions,
      "id" | "method" | "terrainOptions" | "constrainOptions" | "measureOptions" | "planned"
    >;
    result: MovementPlanningResult | null;
    resolve: (document: MovementPlanningResult | null) => void;
    reject: (error: Error) => void;
    violations: string[];
  }

  interface MovementPlanningResult {
    id: string;
    origin: TokenDocument.Position;
    destination: TokenDocument.Position;
    waypoints: TokenDocument.MovementWaypoint[];
  }

  /**
   * @remarks Forwarded to {@linkcode Scene.createEmbeddedDocuments | Scene#createEmbeddedDocuments}; `parent` is
   * always supplied by the layer.
   */
  interface CreateOptions extends InexactPartial<Omit<TokenDocument.Database.CreateOperation, "parent">> {}

  interface PlacementContext {
    data: Iterable<Partial<Document.CreateDataForName<"Token">>>;
    previews: Token.Implementation[];
    placed: TokenDocument.Implementation[];
    index: number;
    resolve: (documents: TokenDocument.Implementation[]) => void;
    reject: (error: Error) => void;
    create: boolean;
    createOptions: TokenLayer.CreateOptions;
    allowRotation: boolean;
    onMove: PlaceTokensOptions["onMove"];
    onRotate: PlaceTokensOptions["onRotate"];
    onChange: PlaceTokensOptions["onChange"];
    preConfirm: PlaceTokensOptions["preConfirm"];
    preSkip: PlaceTokensOptions["preSkip"];
    preCommit: PlaceTokensOptions["preCommit"];
    rotationNotification: boolean;
  }

  interface PlaceTokensOnMoveArgs {
    event: PIXI.FederatedEvent;
    preview: Token.Implementation;
    document: TokenDocument.Implementation;
    index: number;
    count: number;
    position: Canvas.Point;
    snap: boolean;
  }

  interface PlaceTokensOnRotateArgs {
    event: WheelEvent;
    preview: Token.Implementation;
    document: TokenDocument.Implementation;
    index: number;
    count: number;
    precise: boolean;
  }

  interface PlaceTokensOnChangeArgs {
    preview: Token.Implementation;
    document: TokenDocument.Implementation;
    index: number;
    count: number;
  }

  interface PlaceTokensPreConfirmArgs {
    event: PIXI.FederatedEvent;
    document: TokenDocument.Implementation;
    index: number;
    count: number;
  }

  /** @internal */
  interface _PlaceTokensOptions {
    /**
     * Create the Tokens? If false, the preview documents is returned. Non-GMs cannot create Tokens while the game
     * is paused.
     * @defaultValue `true`
     */
    create: boolean;

    /**
     * Optional creation options. By default the creation option `controlObject` is true.
     * @defaultValue `{}`
     */
    createOptions: TokenLayer.CreateOptions;

    /**
     * Allow rotation of the Tokens?
     * @defaultValue `true`
     */
    allowRotation: boolean;
  }

  interface PlaceTokensOptions extends InexactPartial<_PlaceTokensOptions> {
    /**
     * Called when the pointer is moved and after starting the placement of the next Token on confirm and skip. This
     * callback replaces the default behavior if false is returned. If false is returned, the callback should modify
     * the passed `document` and set the render flags on `preview` corresponding to the applied changes.
     */
    onMove?: ((args: PlaceTokensOnMoveArgs) => boolean | void) | undefined;

    /**
     * Called when the mouse wheel is scrolled. This callback replaces the default behavior if false is returned.
     * If false is returned, the callback should modify the `document` and set the render flags on `preview`
     * corresponding to the applied changes.
     */
    onRotate?: ((args: PlaceTokensOnRotateArgs) => boolean | void) | undefined;

    /**
     * Called when the position or rotation of the Token that is placed has changed.
     */
    onChange?: ((args: PlaceTokensOnChangeArgs) => void) | undefined;

    /**
     * Called before the confirmation (left-click) of a Token placement. This callback may return false to prevent
     * the placement of the Token and display a warning.
     */
    preConfirm?: ((args: PlaceTokensPreConfirmArgs) => boolean | void) | undefined;

    /**
     * Called before skipping (right-click) of a Token placement. This callback may return false to prevent
     * skipping of the Token and display a warning.
     */
    preSkip?: ((args: PlaceTokensPreConfirmArgs) => boolean | void) | undefined;

    /**
     * Called at the end of the workflow before the Token documents are created/returned. This callback may return
     * a falsely value other than undefined to prevent the Tokens from being created/returned.
     */
    preCommit?: ((documents: readonly TokenDocument.Implementation[]) => MaybePromise<void>) | undefined;
  }
}

export default TokenLayer;

declare abstract class AnyTokenLayer extends TokenLayer {
  constructor(...args: never);
}
