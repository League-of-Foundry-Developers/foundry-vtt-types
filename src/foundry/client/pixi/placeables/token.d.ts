import {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName
} from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * A Token is an implementation of PlaceableObject which represents an Actor within a viewed Scene on the game canvas.
   * @see TokenDocument
   * @see TokenLayer
   */
  class Token extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>> {
    /**
     * A Ray which represents the Token's current movement path
     */
    protected _movement: Ray | null;

    /**
     * An Object which records the Token's prior velocity dx and dy
     * This can be used to determine which direction a Token was previously moving
     */
    protected _velocity: Token.Velocity;

    /**
     * The Token's most recent valid position
     */
    protected _validPosition: { x: number; y: number };

    /**
     * Track the set of User documents which are currently targeting this Token
     */
    targeted: Set<User>;

    /**
     * A reference to the VisionSource object which defines this vision source area of effect
     */
    vision: VisionSource;

    /**
     * A reference to the LightSource object which defines this light source area of effect
     */
    light: LightSource;

    /**
     * A linked ObjectHUD element which is synchronized with the location and visibility of this Token
     * @defaultValue `new ObjectHUD(this);`
     */
    hud: Token.ObjectHUD;

    /** @defaultValue `undefined` */
    texture?: PIXI.Texture | null;

    /** @defaultValue `undefined` */
    border?: PIXI.Graphics;

    /** @defaultValue `undefined` */
    icon?: PIXI.Sprite;

    static override embeddedName: "Token";

    /**
     * Establish an initial velocity of the token based on it's direction of facing.
     * Assume the Token made some prior movement towards the direction that it is currently facing.
     */
    protected _getInitialVelocity(): Token.Velocity;

    /**
     * A convenient reference to the Actor object associated with the Token embedded document.
     */
    get actor(): this["document"]["actor"];

    /**
     * A convenient reference for whether the current User has full control over the Token document.
     */
    get owner(): boolean;

    get isOwner(): boolean;

    /**
     * A boolean flag for whether the current game User has observer permission for the Token
     */
    get observer(): boolean;

    /**
     * Is the HUD display active for this token?
     */
    get hasActiveHUD(): boolean;

    /**
     * Convenience access to the token's nameplate string
     * @remarks
     * This is actually a getter that returns data.name
     */
    readonly name: string;

    override get bounds(): Rectangle;

    /**
     * Translate the token's grid width into a pixel width based on the canvas size
     */
    get w(): number;

    /**
     * Translate the token's grid height into a pixel height based on the canvas size
     */
    get h(): number;

    /**
     * The Token's current central position
     */
    get center(): ReturnType<this["getCenter"]>;

    /**
     * The HTML source element for the primary Tile texture
     */
    get sourceElement(): HTMLImageElement | HTMLVideoElement | undefined;

    /**
     * Does this Tile depict an animated video texture?
     */
    get isVideo(): boolean;

    /**
     * An indicator for whether or not this token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * Return a reference to a Combatant that represents this Token, if one is present in the current encounter.
     */
    get combatant(): InstanceType<ConfiguredDocumentClass<typeof Combatant>> | null;

    /**
     * An indicator for whether the Token is currently targeted by the active game User
     */
    get isTargeted(): boolean;

    /**
     * Determine whether the Token is visible to the calling user's perspective.
     * Hidden Tokens are only displayed to GM Users.
     * Non-hidden Tokens are always visible if Token Vision is not required.
     * Controlled tokens are always visible.
     * All Tokens are visible to a GM user if no Token is controlled.
     *
     * @see {@link SightLayer#testVisibility}
     */
    get isVisible(): boolean;

    /**
     * The animation name used for Token movement
     */
    get movementAnimationName(): string;

    /**
     * Test whether the Token has sight (or blindness) at any radius
     */
    get hasSight(): boolean;

    /**
     * Test whether the Token emits light (or darkness) at any radius
     */
    get emitsLight(): boolean;

    /**
     * Test whether the Token has a limited angle of vision or light emission which would require sight to update on Token rotation
     */
    get hasLimitedVisionAngle(): boolean;

    /**
     * Translate the token's sight distance in units into a radius in pixels.
     * @returns The sight radius in pixels
     */
    get dimRadius(): number;

    /**
     * Translate the token's bright light distance in units into a radius in pixels.
     * @returns The bright radius in pixels
     */
    get brightRadius(): number;

    /**
     * The named identified for the source object associated with this Token
     */
    get sourceId(): string;

    /**
     * Update the light and vision source objects associated with this Token
     * @param options - (default: `{}}`)
     */
    updateSource(options?: Token.UpdateSourceOptions | undefined): void;

    /**
     * Update an emitted light source associated with this Token.
     * @param options - (default `{}`)
     */
    updateLightSource(options?: Token.UpdateLightSourceOptions | undefined): void;

    /**
     * Update an Token vision source associated for this token.
     * @param options - (default `{}`)
     */
    updateVisionSource(options?: Token.UpdateVisionSourceOptions | undefined): void;

    /**
     * Test whether this Token is a viable vision source for the current User
     * @internal
     */
    protected _isVisionSource(): boolean;

    override clear(): this;

    override draw(): Promise<this>;

    /**
     * Draw the HUD container which provides an interface for managing this Token
     * @internal
     */
    protected _drawHUD(): Token.InitializedObjectHUD;

    override destroy(options?: Parameters<PlaceableObject["destroy"]>[0]): void;

    /**
     * Apply initial sanitizations to the provided input data to ensure that a Token has valid required attributes.
     */
    protected _cleanData(): void;

    /**
     * Draw resource bars for the Token
     */
    protected _drawAttributeBars(): PIXI.Container;

    /**
     * Draw the Sprite icon for the Token
     */
    protected _drawIcon(): Promise<PIXI.Sprite>;

    /**
     * Play video for this Token (if applicable).
     * @param playing - Should the Token video be playing?
     *                  (default: `true`)
     * @param options - Additional options for modifying video playback
     *                  (default: `{}`)
     */
    play(playing?: boolean | undefined, options?: Token.PlayOptions | undefined): void;

    /**
     * Unlink the playback of this video token from the playback of other tokens which are using the same base texture.
     * @param source - The video element source
     * @internal
     */
    protected _unlinkVideoPlayback(source: HTMLVideoElement): Promise<void>;

    /**
     * Update display of the Token, pulling latest data and re-rendering the display of Token components
     */
    refresh(): this;

    /**
     * Size and display the Token Icon
     * @internal
     */
    protected _refreshIcon(): void;

    /**
     * Draw the Token border, taking into consideration the grid type and border color
     * @internal
     */
    protected _refreshBorder(): void;

    /**
     * Get the hex color that should be used to render the Token border
     * @returns The hex color used to depict the border color
     * @internal
     */
    protected _getBorderColor(): number | null;

    /**
     * Refresh the display of the Token HUD interface.
     */
    refreshHUD(): void;

    /**
     * Refresh the target indicators for the Token.
     * Draw both target arrows for the primary User as well as indicator pips for other Users targeting the same Token.
     * @internal
     */
    protected _refreshTarget(): void;

    /**
     * Refresh the display of Token attribute bars, rendering latest resource data
     * If the bar attribute is valid (has a value and max), draw the bar. Otherwise hide it.
     * @internal
     */
    drawBars(): void;

    /**
     * Draw a single resource bar, given provided data
     * @param number - The Bar number
     * @param bar    - The Bar container
     * @param data   - Resource data for this bar
     */
    protected _drawBar(number: number, bar: PIXI.Graphics, data: ReturnType<TokenDocument["getBarAttribute"]>): void;

    /**
     * Draw the token's nameplate as a text object
     * @returns The Text object for the Token nameplate
     */
    protected _drawNameplate(): PreciseText;

    /**
     * Draw a text tooltip for the token which can be used to display Elevation or a resource value
     * @returns The text object used to render the tooltip
     * @internal
     */
    protected _drawTooltip(): PreciseText;

    /**
     * Return the text which should be displayed in a token's tooltip field
     * @internal
     */
    protected _getTooltipText(): string;

    /** @internal */
    protected _getTextStyle(): PIXI.TextStyle;

    /**
     * Draw the active effects and overlay effect icons which are present upon the Token
     */
    drawEffects(): Promise<void>;

    /**
     * Draw the overlay effect icon
     * @param options - (default: `{}`)
     * @internal
     */
    protected _drawOverlay(options?: Token.DrawOverlayOptions | undefined): Promise<void>;

    /**
     * Draw a status effect icon
     * @internal
     */
    protected _drawEffect(src: string, i: number, bg: PIXI.Graphics, w: number, tint: number): Promise<void>;

    /**
     * Helper method to determine whether a token attribute is viewable under a certain mode
     * @param mode - The mode from CONST.TOKEN_DISPLAY_MODES
     * @returns Is the attribute viewable?
     * @internal
     */
    protected _canViewMode(mode: foundry.CONST.TOKEN_DISPLAY_MODES): boolean;

    /**
     * Animate Token movement along a certain path which is defined by a Ray object
     * @param ray - The path along which to animate Token movement
     */
    animateMovement(ray: Ray): Promise<void>;

    /**
     * Animate the continual revealing of Token vision during a movement animation
     * @internal
     */
    protected _onMovementFrame(
      dt: number,
      anim: Array<{
        context: unknown;
        name: string | null;
        duration: number;
        ontick: (dt: number, attributes: CanvasAnimation.Attribute[]) => void;
      }>,
      config: { fog?: boolean; sound?: boolean; source?: boolean }
    ): void;

    /**
     * Update perception each frame depending on the animation configuration
     * @param source - (default: `false`)
     * @param sound  - (default: `false`)
     * @param fog    - (default: `false`)
     * @internal
     */
    protected _animatePerceptionFrame({
      source,
      sound,
      fog
    }?: {
      source?: boolean;
      sound?: boolean;
      fog?: boolean;
    }): void;

    /**
     * Terminate animation of this particular Token
     */
    stopAnimation(): void;

    /**
     * Check for collision when attempting a move to a new position
     * @param destination - The destination point of the attempted movement
     * @returns A true/false indicator for whether the attempted movement caused a collision
     */
    checkCollision(destination: Point): boolean;

    /**
     * @param releaseOthers - (default: `true`)
     * @param pan           - (default: `false`)
     */
    protected override _onControl({ releaseOthers, pan }?: { releaseOthers?: boolean; pan?: boolean }): void;

    protected override _onRelease(
      options: PlaceableObject.ReleaseOptions
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>> | undefined;

    /**
     * Get the center-point coordinate for a given grid position
     * @param x - The grid x-coordinate that represents the top-left of the Token
     * @param y - The grid y-coordinate that represents the top-left of the Token
     * @returns The coordinate pair which represents the Token's center at position (x, y)
     */
    getCenter(
      x: number,
      y: number
    ): {
      x: number;
      y: number;
    };

    /**
     * Set the token's position by comparing its center position vs the nearest grid vertex
     * Return a Promise that resolves to the Token once the animation for the movement has been completed
     * @param x       - The x-coordinate of the token center
     * @param y       - The y-coordinate of the token center
     * @param options - Additional options which configure the token movement
     *                  (defaultValue: `{}`)
     * @returns The Token after animation has completed
     */
    setPosition(x: number, y: number, options?: Token.PositionOptions): Promise<this>;

    /**
     * Update the Token velocity auto-regressively, shifting increasing weight towards more recent movement
     * Employ a magic constant chosen to minimize (effectively zero) the likelihood of trigonometric edge cases
     * @param ray - The proposed movement ray
     * @returns An updated velocity with directional memory
     * @internal
     */
    protected _updateVelocity(ray: Ray): Token.Velocity;

    /**
     * Set this Token as an active target for the current game User
     * @param targeted - Is the Token now targeted?
     *                   (default: `true`)
     * @param context  - Additional context options
     *                   (default `{}`)
     */
    setTarget(targeted?: boolean, context?: Token.SetTargetContext | undefined): void;

    /**
     * Add or remove the currently controlled Tokens from the active combat encounter
     * @param combat - A specific combat encounter to which this Token should be added
     * @returns The Token which initiated the toggle
     */
    toggleCombat(combat?: InstanceType<ConfiguredDocumentClass<typeof Combat>>): Promise<this>;

    /**
     * Toggle an active effect by its texture path.
     * Copy the existing Array in order to ensure the update method detects the data as changed.
     *
     * @param effect  - The texture file-path of the effect icon to toggle on the Token.
     * @param options - Additional optional arguments which configure how the effect is handled.
     *                  (defaultValue: `{}`)
     * @returns Was the texture applied (true) or removed (false)
     */
    toggleEffect(
      effect: string | ConstructorParameters<ConfiguredDocumentClassForName<"ActiveEffect">>[0],
      options?: Token.EffectToggleOptions | undefined
    ): Promise<boolean>;

    /**
     * A helper function to toggle the overlay status icon on the Token
     * @internal
     */
    protected _toggleOverlayEffect(texture: string, { active }?: { active: boolean }): Promise<this>;

    /**
     * Toggle the visibility state of any Tokens in the currently selected set
     * @returns A Promise which resolves to the updated Token documents
     */
    toggleVisibility(): Promise<InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>[]>;

    /**
     * Return the token's sight origin, tailored for the direction of their movement velocity to break ties with walls
     */
    getSightOrigin(): {
      x: number;
      y: number;
    };

    /**
     * A generic transformation to turn a certain number of grid units into a radius in canvas pixels.
     * This function adds additional padding to the light radius equal to half the token width.
     * This causes light to be measured from the outer token edge, rather than from the center-point.
     * @param units - The radius in grid units
     * @returns The radius in canvas units
     */
    getLightRadius(units: number): number;

    protected override _getShiftedPosition(dx: number, dy: number): { x: number; y: number };

    override rotate(...args: Parameters<PlaceableObject["rotate"]>): Promise<this>;

    protected override _onCreate(
      options: InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>["data"]["_source"],
      userId: DocumentModificationOptions
    ): void;

    protected override _onUpdate(
      data?: DeepPartial<InstanceType<ConfiguredDocumentClass<typeof TokenDocument>>["data"]["_source"]>,
      options?: DocumentModificationOptions & { animate?: boolean },
      userId?: string
    ): void;

    protected override _onDelete(options?: DocumentModificationOptions, userId?: string): void;

    protected override _canControl(
      user?: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event?: PIXI.InteractionEvent
    ): boolean;

    protected override _canHUD(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event?: PIXI.InteractionEvent
    ): boolean;

    protected override _canConfigure(
      user?: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event?: PIXI.InteractionEvent
    ): true;

    protected override _canHover(
      user?: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event?: PIXI.InteractionEvent
    ): true;

    protected override _canView(
      user?: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event?: PIXI.InteractionEvent
    ): boolean;

    protected override _canDrag(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      event: PIXI.InteractionEvent
    ): boolean;

    protected override _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers?: boolean }): void;

    protected override _onHoverOut(event: PIXI.InteractionEvent): false | void;

    protected override _onClickLeft(event: PIXI.InteractionEvent): void;

    protected override _onClickLeft2(event?: PIXI.InteractionEvent): void;

    protected override _onClickRight2(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<any>;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftCancel(event: MouseEvent): void;
    /**
     * @remarks This does not exist in foundry. It marks the controlIcon as not used because `Token` does never store a value here.
     */
    controlIcon: null;
  }

  namespace Token {
    interface Bar {
      attribute: string;
    }

    interface Velocity {
      dx: number;
      sx: number;
      dy: number;
      sy: number;
    }

    /** The UI frame container which depicts Token metadata and status, displayed in the ControlsLayer. */
    interface ObjectHUD extends globalThis.ObjectHUD {
      /** Token health bars */
      bars?: PIXI.Container;

      /** Token nameplate */
      nameplate?: PreciseText;

      /** Token elevation tooltip */
      tooltip?: PreciseText;

      /** Token status effects */
      effects?: PIXI.Container;

      /** Token target marker */
      target?: PIXI.Graphics;
    }

    type InitializedObjectHUD = RequiredProps<ObjectHUD, "bars" | "nameplate" | "tooltip" | "effects" | "target">;

    interface UpdateLightSourceOptions {
      /**
       * Defer refreshing the LightingLayer to manually call that refresh later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this light source has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;
    }

    interface UpdateVisionSourceOptions {
      /**
       * Defer refreshing the SightLayer to manually call that refresh later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this vision source has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;

      /**
       * Never update the Fog exploration progress for this update.
       * @defaultValue `false`
       */
      skipUpdateFog?: boolean | undefined;
    }

    type UpdateSourceOptions = UpdateLightSourceOptions & UpdateVisionSourceOptions;

    interface PlayOptions {
      /**
       * Should the video loop?
       * @defaultValue `true`
       */
      loop?: boolean | undefined;

      /**
       * A specific timestamp between 0 and the video duration to begin playback
       * @defaultValue `0`
       */
      offset?: number | undefined;

      /**
       * Desired volume level of the video's audio channel (if any)
       * @defaultValue `0`
       */
      volume?: number | undefined;
    }

    interface DrawOverlayOptions {
      src?: string | undefined;
      tint?: number | undefined;
    }

    interface PositionOptions {
      /**
       * Animate the movement path
       * @defaultValue `true`
       */
      animate?: boolean;

      /**
       * Automatically re-center the view if token movement goes off-screen
       * @defaultValue `true`
       */
      recenter?: boolean | undefined;
    }

    interface EffectToggleOptions {
      /**
       * Force a certain active state for the effect
       * @defaultValue `false`
       */
      active?: boolean | undefined;

      /**
       * Whether to set the effect as the overlay effect?
       * @defaultValue `false`
       */
      overlay?: boolean | undefined;
    }

    interface SetTargetContext {
      /**
       * Assign the token as a target for a specific User
       * @defaultValue `null`
       */
      user?: InstanceType<ConfiguredDocumentClass<typeof User>> | null | undefined;

      /**
       * Release other active targets for the same player?
       * @defaultValue `true`
       */
      releaseOthers?: boolean | undefined;

      /**
       * Is this target being set as part of a group selection workflow?
       * @defaultValue `Is this target being set as part of a group selection workflow?`
       */
      groupSelection?: boolean | undefined;
    }
  }

  /**
   * A "secret" global to help debug attributes of the currently controlled Token.
   * This is only for debugging, and may be removed in the future, so it's not safe to use.
   */
  let _token: InstanceType<ConfiguredObjectClassForName<"Token">> | null;
}
