export {};

declare global {
  /**
   * The Tokens Container
   */
  class TokenLayer extends PlaceablesLayer<"Token"> {
    /**
     * The current index position in the tab cycle
     * @defaultValue `null`
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
     *  canDragCreate: false,
     *  controllableObjects: true,
     *  rotatableObjects: true,
     *  elevationSorting: true,
     *  zIndex: 100
     * })
     * ```
     */
    static override get layerOptions(): TokenLayer.LayerOptions;

    static override documentName: "Token";

    override get hookName(): string;

    override get gridPrecision(): 1;

    /**
     * Token objects on this layer utilize the TokenHUD
     */
    get hud(): TokenHUD;

    /**
     * An Array of tokens which belong to actors which are owned
     */
    get ownedTokens(): ReturnType<this["placeables"]["filter"]>;

    override _draw(options?: Record<string, unknown>): Promise<void>;

    override _tearDown(options?: Record<string, unknown>): Promise<void>;

    override _activate(): void;

    override _deactivate(): void;

    /**
     * Target all Token instances which fall within a coordinate rectangle.
     * @param rectangle - The selection rectangle.
     * @param options   - Additional options to configure targeting behaviour.
     * @returns The number of Token instances which were targeted.
     */
    targetObjects(
      rectangle: {
        /** The top-left x-coordinate of the selection rectangle */
        x: number;

        /** The top-left y-coordinate of the selection rectangle */
        y: number;

        /** The width of the selection rectangle */
        width: number;

        /** The height of the selection rectangle */
        height: number;
      },
      options?: {
        /**
         * Whether or not to release other targeted tokens
         * @defaultValue `true`
         */
        releaseOthers?: boolean;
      },
    ): number;

    /**
     * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
     * Tokens are currently sorted in order of their TokenID
     *
     * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
     * @param reset    - Restart the cycle order back at the beginning?
     * @returns The Token object which was cycled to, or null
     */
    cycleTokens(forwards: boolean, reset: boolean): ConfiguredTokenDocument | null;

    /**
     * Add or remove the set of currently controlled Tokens from the active combat encounter
     * @param  state  - The desired combat state which determines if each Token is added (true) or removed (false)
     *                  (default: `true`)
     * @param  combat - A Combat encounter from which to add or remove the Token
     *                  (default: `null`)
     * @returns The Combatants added or removed
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
        token?: ConfiguredTokenDocument | null;
      },
    ): Promise<Combatant.ConfiguredInstance[]>;

    /**
     * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
     */
    protected _getCycleOrder(): ConfiguredTokenDocument[];

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
    _getOccludableTokens(): Token[];

    override storeHistory(type: PlaceablesLayer.HistoryEventType, data: ConfiguredTokenDocument["_source"]): void;

    /**
     * Handle dropping of Actor data onto the Scene canvas
     */
    protected _onDropActorData(
      event: DragEvent,
      data: TokenLayer.DropData,
    ): Promise<void | false | ConfiguredTokenDocument>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Reset canvas and tokens mouse manager.
     */
    onClickTokenTools(): void;
  }

  namespace TokenLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Token"> {
      name: "tokens";
      canDragCreate: false;
      controllableObjects: true;
      rotatableObjects: true;
      elevationSorting: true;
      zIndex: 100;
    }

    interface DropData extends Canvas.DropPosition {
      type: "Actor";
      uuid: string;
    }
  }
}

type ConfiguredTokenDocument = TokenDocument.ConfiguredInstance;
