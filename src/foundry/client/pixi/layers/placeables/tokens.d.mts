import type { HandleEmptyObject, Identity, NullishProps } from "#utils";
import type Document from "#common/abstract/document.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TokenLayer: TokenLayer.Any;
    }
  }
}

declare global {
  /**
   * The Tokens Container
   */
  class TokenLayer extends PlaceablesLayer<"Token"> {
    /**
     * The current index position in the tab cycle
     * @defaultValue `null`
     * @remarks Foundry marked `@private` but sets it `null` in  {@link Canvas#_onDragRightMove}
     */
    protected _tabIndex: number | null;

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
     *  zIndex: 200
     * })
     * ```
     */
    static override get layerOptions(): TokenLayer.LayerOptions;

    static override documentName: "Token";

    /**
     * The set of tokens that trigger occlusion (a union of {@linkcode CONST.TOKEN_OCCLUSION_MODES}).
     */
    set occlusionMode(value: foundry.CONST.OCCLUSION_MODES);

    get occlusionMode();

    override get hookName(): "TokenLayer";

    /**
     * Token objects on this layer utilize the TokenHUD
     */
    get hud(): NonNullable<Canvas["hud"]>["token"];

    /**
     * An Array of tokens which belong to actors which are owned
     */
    get ownedTokens(): Token.Implementation[];

    /** @remarks Forces top left corner snapping */
    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    protected override _draw(options: HandleEmptyObject<TokenLayer.DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<TokenLayer.TearDownOptions>): Promise<void>;

    protected override _activate(): void;

    protected override _deactivate(): void;

    protected override _pasteObject(
      copy: Token.Implementation,
      offset: Canvas.Point,
      options?: PlaceablesLayer.PasteOptions, // not:null (destructured)
    ): Omit<TokenDocument.Source, "_id">;

    /** @remarks Returns `[]` if the ruler is currently measuring */
    protected override _getMovableObjects(
      ids?: string[] | null,
      includeLocked?: boolean | null,
    ): Token.Implementation[];

    /**
     * Target all Token instances which fall within a coordinate rectangle.
     * @param rectangle - The selection rectangle.
     * @param options   - Additional options to configure targeting behaviour.
     * @returns The number of Token instances which were targeted.
     */
    targetObjects(
      rectangle: Canvas.Rectangle,
      options?: TokenLayer.TargetObjectsOptions, // not:null (destructured)
    ): number;

    /**
     * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
     * Tokens are currently sorted in order of their TokenID
     * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
     * @param reset    - Restart the cycle order back at the beginning?
     * @returns The Token object which was cycled to, or null
     * @remarks Neither parameter has a default, so a call with no arguments cycles backward without resetting
     *
     * Also selects the returned token if any, and pans the camera to its center
     */
    cycleTokens(forwards?: boolean | null, reset?: boolean | null): Token.Implementation | null;

    /**
     * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
     * @remarks Foundry marked `@private`
     */
    protected _getCycleOrder(): Token.Implementation[];

    /**
     * Immediately conclude the animation of any/all tokens
     */
    concludeAnimation(): void;

    /**
     * Animate targeting arrows on targeted tokens.
     */
    protected _animateTargets(): void;

    /**
     * Provide an array of Tokens which are eligible subjects for overhead tile occlusion.
     * By default, only tokens which are currently controlled or owned by a player are included as subjects.
     */
    protected _getOccludableTokens(): Token.Implementation[];

    /** @remarks "Clean actorData and delta updates from the history so changes to those fields are not undone" */
    override storeHistory<Operation extends Document.Database.Operation>(
      type: Operation,
      data: PlaceablesLayer.HistoryDataFor<Operation, "Token">,
    ): void;

    /**
     * Handle dropping of Actor data onto the Scene canvas
     * @remarks Foundry marked `@private`
     */
    protected _onDropActorData(
      event: DragEvent,
      data: TokenLayer.DropData,
    ): Promise<ReturnType<foundry.applications.ui.Notifications["warn"]> | false | TokenDocument.Implementation>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onMouseWheel(event: WheelEvent): Promise<Token.Implementation[] | void>;

    /**
     * @deprecated since v12 until v14
     * @remarks "TokenLayer#gridPrecision is deprecated. Use TokenLayer#getSnappedPoint instead of GridLayer#getSnappedPosition and TokenLayer#gridPrecision."
     */
    override get gridPrecision(): 1;

    /**
     * Add or remove the set of currently controlled Tokens from the active combat encounter
     * @param  state  - The desired combat state which determines if each Token is added (true) or removed (false)
     *                  (default: `true`)
     * @param  combat - A Combat encounter from which to add or remove the Token
     *                  (default: `null`)
     * @returns The Combatants added or removed
     * @deprecated since v12 until v14
     * @remarks "TokenLayer#toggleCombat is deprecated in favor of TokenDocument.implementation.createCombatants and TokenDocument.implementation.deleteCombatants"
     */
    toggleCombat(
      state?: boolean | null,
      combat?: Combat.Implementation | null,
      options?: TokenLayer.ToggleCombatOptions, // not:null (destructured)
    ): Promise<Combatant.Implementation[]>;
  }

  namespace TokenLayer {
    interface Any extends AnyTokenLayer {}
    interface AnyConstructor extends Identity<typeof AnyTokenLayer> {}

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<Token.ImplementationClass> {
      name: "tokens";
      controllableObjects: true;
      rotatableObjects: true;
      zIndex: 200;
    }

    interface DropData extends Canvas.DropPosition {
      type: "Actor";
      uuid: string;
    }

    /** @internal */
    // TODO: the NP should probably be on the PO side, update once PO has been done
    type _TargetObjectsOptions = NullishProps<PlaceableObject.ControlOptions>;

    interface TargetObjectsOptions extends _TargetObjectsOptions {}

    /** @internal */
    type _ToggleCombatOptions = NullishProps<{
      /**
       * A specific Token which is the origin of the group toggle request
       * @defaultValue `null`
       */
      token: Token.Implementation;
    }>;
    interface ToggleCombatOptions extends _ToggleCombatOptions {}
  }
}

declare abstract class AnyTokenLayer extends TokenLayer {
  constructor(...args: never);
}
