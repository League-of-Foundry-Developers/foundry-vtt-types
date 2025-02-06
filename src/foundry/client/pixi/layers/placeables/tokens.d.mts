import type { ArrayOverlaps, NullishProps } from "fvtt-types/utils";
import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * The Tokens Container
   */
  class TokenLayer<
    DrawOptions extends TokenLayer.DrawOptions = TokenLayer.DrawOptions,
    TearDownOptions extends TokenLayer.TearDownOptions = TokenLayer.TearDownOptions,
  > extends PlaceablesLayer<"Token", DrawOptions, TearDownOptions> {
    /**
     * The current index position in the tab cycle
     * @defaultValue `null`
     * @remarks Foundry marked \@private but accesses it from Canvas
     */
    _tabIndex: number | null;

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
     * The set of tokens that trigger occlusion (a union of {@link CONST.TOKEN_OCCLUSION_MODES}).
     */
    set occlusionMode(value: number);

    get occlusionMode(): number;

    override get hookName(): string;

    /**
     * Token objects on this layer utilize the TokenHUD
     */
    get hud(): TokenHUD;

    /**
     * An Array of tokens which belong to actors which are owned
     */
    get ownedTokens(): ReturnType<this["placeables"]["filter"]>;

    override getSnappedPoint(point: Canvas.Point): Canvas.Point;

    protected override _draw(options?: DrawOptions): Promise<void>;

    protected override _tearDown(options?: TearDownOptions): Promise<void>;

    protected override _activate(): void;

    protected override _deactivate(): void;

    override _pasteObject(
      copy: Token.ConfiguredInstance,
      offset: Canvas.Point,
      options?: NullishProps<{ hidden: boolean; snap: boolean }>,
    ): Document.ConfiguredSourceForName<"Token">;

    protected override _getMovableObjects<const T>(
      ids?: ArrayOverlaps<T, string>,
      includeLocked?: boolean,
    ): Token.ConfiguredInstance[];

    /**
     * Target all Token instances which fall within a coordinate rectangle.
     * @param rectangle - The selection rectangle.
     * @param options - Additional options to configure targeting behaviour.
     */
    targetObjects(rectangle: Canvas.Rectangle, options?: NullishProps<PlaceableObject.ControlOptions>): number;

    /**
     * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
     * Tokens are currently sorted in order of their TokenID
     * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
     * @param reset    - Restart the cycle order back at the beginning?
     */
    cycleTokens(forwards: boolean, reset: boolean): Token.ConfiguredInstance | null;

    /**
     * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
     */
    protected _getCycleOrder(): Token.ConfiguredInstance[];

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
    protected _getOccludableTokens(): Token.ConfiguredInstance[];

    override storeHistory(
      type: PlaceablesLayer.HistoryEventType,
      data: Document.ConfiguredSourceForName<"Token">[],
    ): void;

    /**
     * Handle dropping of Actor data onto the Scene canvas
     */
    protected _onDropActorData(
      event: DragEvent,
      data: TokenLayer.DropData,
    ): Promise<ReturnType<Notifications["warn"]> | false | TokenDocument.ConfiguredInstance>;

    //TODO: use configured ruler type once it exists
    protected override _onClickLeft(event: PIXI.FederatedEvent): void; // ReturnType<CONFIG.Canvas["rulerClass"]["_onClickLeft"]>;

    protected override _onMouseWheel(event: WheelEvent): ReturnType<this["rotateMany"]>;

    /**
     * @deprecated since v12 until v14
     * @remarks "TokenLayer#toggleCombat is deprecated in favor of TokenDocument.implementation.createCombatants and TokenDocument.implementation.deleteCombatants"
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
      state?: boolean,
      combat?: Combat.ConfiguredInstance | null,
      {
        token,
      }?: {
        /**
         * A specific Token which is the origin of the group toggle request
         * @defaultValue `null`
         */
        token?: Token.ConfiguredInstance | null;
      },
    ): Promise<Combatant.ConfiguredInstance[]>;
  }

  namespace TokenLayer {
    type AnyConstructor = typeof AnyTokenLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Token"> {
      name: "tokens";
      controllableObjects: true;
      rotatableObjects: true;
      zIndex: 200;
    }

    interface DropData extends Canvas.DropPosition {
      type: "Actor";
      uuid: string;
    }
  }
}

declare abstract class AnyTokenLayer extends TokenLayer {
  constructor(arg0: never, ...args: never[]);
}
