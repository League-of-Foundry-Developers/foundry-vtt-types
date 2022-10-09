import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from "../../../../types/helperTypes";
import { SelectOptions } from "../placeables";

declare global {
  /**
   * The Tokens Container
   */
  class TokenLayer extends PlaceablesLayer<"Token", TokenLayer.LayerOptions> {
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
    static get instance(): Canvas["tokens"];

    /**
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
    static override get layerOptions(): TokenLayer.LayerOptions;

    static override documentName: "Token";

    override get gridPrecision(): 1;

    /**
     * Token objects on this layer utilize the TokenHUD
     */
    get hud(): TokenHUD;

    /**
     * An Array of tokens which belong to actors which are owned
     */
    get ownedTokens(): ReturnType<this["placeables"]["filter"]>;

    override tearDown(): Promise<this>;

    override activate(): this;

    override deactivate(): this;

    /**
     * @param options - (default: `{}`)
     */
    override selectObjects(options?: SelectOptions): boolean;

    /**
     * Target all Token instances which fall within a coordinate rectangle.
     * @returns The number of Token instances which were targeted.
     */
    targetObjects(
      {
        x,
        y,
        width,
        height
      }: {
        /** The top-left x-coordinate of the selection rectangle */
        x: number;

        /** The top-left y-coordinate of the selection rectangle */
        y: number;

        /** The width of the selection rectangle */
        width: number;

        /** The height of the selection rectangle */
        height: number;
      },
      {
        releaseOthers
      }?: {
        /**
         * Whether or not to release other targeted tokens
         * @defaultValue `true`
         */
        releaseOthers?: boolean;
      }
    ): number;

    /**
     * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
     * Tokens are currently sorted in order of their TokenID
     *
     * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
     * @param reset    - Restart the cycle order back at the beginning?
     * @returns The Token object which was cycled to, or null
     */
    cycleTokens(forwards: boolean, reset: boolean): InstanceType<ConfiguredObjectClassForName<"Token">> | null;

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
      combat?: InstanceType<ConfiguredDocumentClass<typeof Combat>> | null,
      {
        token
      }?: {
        /**
         * A specific Token which is the origin of the group toggle request
         * @defaultValue `null`
         */
        token?: InstanceType<ConfiguredObjectClassForName<"Token">> | null;
      }
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Combatant>>[]>;

    /**
     * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
     */
    protected _getCycleOrder(): InstanceType<ConfiguredObjectClassForName<"Token">>[];

    /**
     * Immediately conclude the animation of any/all tokens
     */
    concludeAnimation(): void;

    /**
     * Handle dropping of Actor data onto the Scene canvas
     */
    protected _onDropActorData(
      event: DragEvent,
      data: TokenLayer.DropData
    ): Promise<void | false | InstanceType<ConfiguredObjectClassForName<"Token">>>;

    protected override _onClickLeft(event: PIXI.InteractionEvent): void;
  }

  namespace TokenLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Token"> {
      name: "tokens";
      canDragCreate: false;
      controllableObjects: true;
      rotatableObjects: true;
      zIndex: 100;
    }

    interface DropData extends Canvas.DropPosition {
      id?: string;
      type?: "Actor";
      pack?: string;
    }
  }
}
