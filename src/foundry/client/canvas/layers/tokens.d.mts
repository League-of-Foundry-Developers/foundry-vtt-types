import type { AnyObject, FixedInstanceType, Identity, InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";
import type { PIXI } from "#configuration";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TokenLayer: TokenLayer.Implementation;
    }
  }
}

/**
 * The Tokens Container
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
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["tokens"];

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: TokenLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "tokens",
   *  controllableObjects: true,
   *  rotatableObjects: true,
   *  confirmDeleteKey: true
   *  zIndex: 200
   * })
   * ```
   */
  static override get layerOptions(): TokenLayer.LayerOptions;

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

  protected override _prepareKeyboardMovementUpdates(
    objects: Token.Implementation[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): PlaceablesLayer.PreparedUpdates<"Token">;

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

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

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _getCycleOrder(): never;

  /**
   * Immediately conclude the animation of any/all tokens
   */
  concludeAnimation(): void;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _animateTargets(): void;

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
  _updatePlannedMovements(user: User.Implementation, plannedMovements: TokenDocument.PlannedMovements | null): void;

  /**
   * Provide an array of Tokens which are eligible subjects for overhead tile occlusion.
   * By default, only tokens which are currently controlled or owned by a player are included as subjects.
   */
  protected _getOccludableTokens(): Token.Implementation[];

  protected override _getMovableObjects(ids?: string[], includeLocked?: boolean): Token.Implementation[];

  protected override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Token.Implementation[];

  override storeHistory<Operation extends Document.Database.Operation>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Token">[],
    options?: PlaceablesLayer.HistoryEntry<"Token">["options"],
  ): void;

  protected override _onCycleViewKey(event: KeyboardEvent): boolean;

  protected override _confirmDeleteKey(documents: TokenDocument.Implementation[]): Promise<boolean | null>;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _highlightObjects(active: boolean): void;

  /**
   * Handle dropping of Actor data onto the Scene canvas
   * @internal
   */
  protected _onDropActorData(
    event: DragEvent,
    data: TokenLayer.DropData,
  ): Promise<ReturnType<foundry.applications.ui.Notifications["warn"]> | false | TokenDocument.Implementation>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _onClickRight2(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Token.Implementation[]> | void;

  /**
   * @deprecated "`TokenLayer#gridPrecision` is deprecated. Use {@linkcode TokenLayer.getSnappedPoint | TokenLayer#getSnappedPoint}
   * instead of `GridLayer#getSnappedPosition` and `TokenLayer#gridPrecision`." (since v12, until v14)
   */
  override get gridPrecision(): 1;

  /**
   * Add or remove the set of currently controlled Tokens from the active combat encounter
   * @param  state  - The desired combat state which determines if each Token is added (true) or removed (false) (default: `true`)
   * @param  combat - A Combat encounter from which to add or remove the Token (default: `null`)
   * @returns The Combatants added or removed
   * @deprecated "`TokenLayer#toggleCombat` is deprecated in favor of {@linkcode TokenDocument.implementation.createCombatants} and
   * {@linkcode TokenDocument.implementation.deleteCombatants}" (since v12, until v14)
   */
  toggleCombat(
    state?: boolean,
    combat?: Combat.Implementation | null,
    options?: TokenLayer.ToggleCombatOptions,
  ): Promise<Combatant.Implementation[]>;

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

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["tokens"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Token.ImplementationClass> {
    name: "tokens";
    controllableObjects: true;
    rotatableObjects: true;
    confirmDeleteKey: true;
    zIndex: 200;
  }

  /** @remarks The waypoint data {@linkcode TokenLayer.storeHistory | TokenLayer#storeHistory} includes in movement-including update `undoOptions` */
  interface MovementUpdateHistoryWaypoint
    extends Pick<TokenDocument.MeasuredMovementWaypoint, keyof TokenDocument.Position | "action"> {}

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

  /** @internal */
  type _TargetObjectsOptions = InexactPartial<{
    /**
     * Whether or not to release other targeted tokens
     * @defaultValue `true`
     */
    releaseOthers: boolean;
  }>;

  interface TargetObjectsOptions extends _TargetObjectsOptions {}

  type SetTargetMode = "replace" | "acquire" | "release";

  /** @internal */
  type _SetTargetsOptions = InexactPartial<{
    /**
     * The mode that determines the targeting behavior.
     *   - `"replace"` (default): Replace the current set of targeted Tokens with provided set of Tokens.
     *   - `"acquire"`: Acquire the given Tokens as targets without releasing already targeted Tokens.
     *   - `"release"`: Release the given Tokens as targets.
     * @defaultValue `"replace"`
     */
    mode: SetTargetMode;
  }>;

  interface SetTargetsOptions extends _SetTargetsOptions {}

  /** @internal */
  type _ToggleCombatOptions = InexactPartial<{
    /**
     * A specific Token which is the origin of the group toggle request
     * @defaultValue `null`
     */
    token: Token.Implementation | null;
  }>;

  interface ToggleCombatOptions extends _ToggleCombatOptions {}
}

export default TokenLayer;

declare abstract class AnyTokenLayer extends TokenLayer {
  constructor(...args: never);
}
