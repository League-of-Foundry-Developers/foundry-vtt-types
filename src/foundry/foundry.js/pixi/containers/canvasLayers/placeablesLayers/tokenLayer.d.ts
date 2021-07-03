import { SelectOptions } from '../placeablesLayer';

declare global {
  /**
   * The Tokens Container
   */
  class TokenLayer extends PlaceablesLayer<'Token', TokenLayer.LayerOptions> {
    constructor();

    /**
     * The current index position in the tab cycle
     * @defaultValue `null`
     */
    protected _tabIndex: number | null;

    /**
     * Remember the last drawn wildcard token image to avoid repetitions
     * @defaultValue `null`
     */
    protected _lastWildcard: string | null;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): TokenLayer;

    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "tokens",
     *  canDragCreate: false,
     *  controllableObjects: true,
     *  rotatableObjects: true,
     *  zIndex: 100
     * })
     * ```
     */
    static get layerOptions(): TokenLayer.LayerOptions;

    /**
     * @override
     */
    static documentName: 'Token';

    /** @override */
    get gridPrecision(): 1;

    /**
     * Token objects on this layer utilize the TokenHUD
     */
    get hud(): TokenHUD;

    /**
     * An Array of tokens which belong to actors which are owned
     */
    get ownedTokens(): ReturnType<this['placeables']['filter']>;

    /** @override */
    tearDown(): Promise<this>;

    /** @override */
    activate(): this;

    /** @override */
    deactivate(): this;

    /**
     * @override
     * @param options - (default: `{}`)
     */
    selectObjects(options?: SelectOptions): boolean;

    /**
     * Target all Token instances which fall within a coordinate rectangle.
     *
     * @param x             - The top-left x-coordinate of the selection rectangle
     * @param y             - The top-left y-coordinate of the selection rectangle
     * @param width         - The width of the selection rectangle
     * @param height        - The height of the selection rectangle
     * @param releaseOthers - Whether or not to release other targeted tokens
     *                        (default: `true`)
     * @returns The number of Token instances which were targeted.
     */
    targetObjects(
      { x, y, width, height }: { x: number; y: number; width: number; height: number },
      { releaseOthers }?: { releaseOthers?: boolean }
    ): number;

    /**
     * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
     * Tokens are currently sorted in order of their TokenID
     *
     * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
     * @param reset    - Restart the cycle order back at the beginning?
     * @returns The Token object which was cycled to, or null
     */
    cycleTokens(forwards: boolean, reset: boolean): Token | null;

    /**
     * Add or remove the set of currently controlled Tokens from the active combat encounter
     * @param  state  - The desired combat state which determines if each Token is added (true) or removed (false)
     *                  (default: `true`)
     * @param  combat - A Combat encounter from which to add or remove the Token
     *                  (default: `null`)
     * @param  token  - A specific Token which is the origin of the group toggle request
     *                  (default: `null`)
     * @returns The updated Combat encounter
     * @remarks Returns the created Combatants or undefined if there is no combat and one can't be created
     *          or the combat if the user is no GM and wants to remove combatants.
     */
    toggleCombat(
      state?: boolean,
      combat?: Combat | null,
      { token }?: { token?: Token | null }
    ): Promise<Combat | Combatant[] | void>;

    /**
     * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
     */
    protected _getCycleOrder(): Token[];

    /**
     * Immediately conclude the animation of any/all tokens
     */
    concludeAnimation(): void;

    /**
     * Handle dropping of Actor data onto the Scene canvas
     */
    protected _onDropActorData(event: DragEvent, data: TokenLayer.DropData): Promise<void | false | Token>;
  }

  namespace TokenLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<'Token'> {
      name: 'tokens';
      canDragCreate: false;
      controllableObjects: true;
      rotatableObjects: true;
      zIndex: 100;
    }

    interface DropData extends Canvas.DropPosition {
      id?: string;
      type?: 'Actor';
      pack?: string;
    }
  }
}
