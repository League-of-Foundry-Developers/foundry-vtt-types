// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A Token is an implementation of PlaceableObject which represents an Actor within a viewed Scene on the game canvas.
 *
 * @example
 * ```typescript
 * Token.create<Token>({
 *   name: "Token Name",
 *   x: 1000,
 *   y: 1000,
 *   displayName: 3,
 *   img: "path/to/token-artwork.png",
 *   width: 2,
 *   height: 2,
 *   scale: 1.2,
 *   elevation: 50,
 *   lockRotation: false,
 *   rotation: 30,
 *   effects: ["icons/stun.png"],
 *   overlayEffect: "icons/dead.png",
 *   vision: true,
 *   dimSight: 60,
 *   brightSight: 0,
 *   dimLight: 40,
 *   brightLight: 20,
 *   sightAngle: 60,
 *   hidden: false,
 *   actorId: "dfgkjt43jkvdfkj34t",
 *   actorLink: true,
 *   actorData: {},
 *   disposition: 1,
 *   displayBars: 3,
 *   bar1: {attribute: "attributes.hp"},
 *   bar2: {attribute: "attributes.sp"}
 * }
 * ```
 */
declare class Token extends PlaceableObject<Token.Data> {
  /**
   * @remarks Not used for `Token`
   */
  controlIcon: null;

  /**
   * A Ray which represents the Token's current movement path
   */
  protected _movement: Ray | null;

  /**
   * An Object which records the Token's prior velocity dx and dy
   * This can be used to determine which direction a Token was previously moving
   */
  protected _velocity: {
    dx: number | null;
    dy: number | null;
    sx: number | null;
    sy: number | null;
  };

  /**
   * The Token's most recent valid position
   */
  protected _validPosition: { x: number; y: number };

  /**
   * Provide a temporary flag through which this Token can be overridden to bypass any movement animation
   */
  protected _noAnimate: boolean;

  /**
   * Track the set of User entities which are currently targeting this Token
   */
  targeted: Set<User>;

  /**
   * An Actor entity constructed using this Token's data
   * If actorLink is true, then the entity is the true Actor entity
   * Otherwise, the Actor entity is a synthetic, constructed using the Token actorData
   * @remarks
   * This should be typecast to your systems actor if needed.
   */
  actor: Actor;

  /**
   * A reference to the PointSource object which defines this vision source area of effect
   */
  vision: PointSource;

  /**
   * A reference to the PointSource object which defines this light source area of effect
   */
  light: PointSource;

  /** @override */
  static get embeddedName(): 'Token';

  /**
   * Apply initial sanitizations to the provided input data to ensure that a Token has valid required attributes.
   */
  protected _cleanData(): void;

  /**
   * @remarks
   * Not implemented by Token
   */
  get bounds(): never;

  /**
   * A Boolean flag for whether the current game User has permission to control this token
   */
  get owner(): boolean;

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
  name: string;

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
  get center(): {
    /*
     * @property x The central x-coordinate
     */
    x: number;
    /*
     * @property y The central y-coordinate
     */
    y: number;
  };

  /**
   * An indicator for whether or not this token is currently involved in the active combat encounter.
   */
  get inCombat(): boolean;

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
   * @param defer       - Defer refreshing the SightLayer to manually call that refresh later.
   * @param deleted     - Indicate that this light source has been deleted.
   * @param noUpdateFog - Never update the Fog exploration progress for this update.
   */
  updateSource({ defer, deleted, noUpdateFog }?: { defer?: boolean; deleted?: boolean; noUpdateFog?: boolean }): void;

  /**
   * Test whether this Token is a viable vision source for the current User
   */
  protected _isVisionSource(): boolean;

  /** @override */
  draw(): Promise<this>;

  /**
   * Draw resource bars for the Token
   */
  protected _drawAttributeBars(): PIXI.Container;

  /**
   * Draw the Sprite icon for the Token
   */
  protected _drawIcon(): Promise<PIXI.Sprite>;

  /**
   * Update display of the Token, pulling latest data and re-rendering the display of Token components
   */
  refresh(): void;

  /**
   * Draw the Token border, taking into consideration the grid type and border color
   */
  protected _refreshBorder(): void;

  /**
   * Get the hex color that should be used to render the Token border
   * @returns The hex color used to depict the border color
   */
  protected _getBorderColor(): number | null;

  /**
   * Refresh the target indicators for the Token.
   * Draw both target arrows for the primary User as well as indicator pips for other Users targeting the same Token.
   */
  protected _refreshTarget(): void;

  /**
   * A helper method to retrieve the underlying data behind one of the Token's attribute bars
   * @param barName     - The named bar to retrieve the attribute for
   * @param alternative - An alternative attribute path to get instead of the default one
   * @returns The attribute displayed on the Token bar, if any
   */
  getBarAttribute(
    barName: string,
    { alternative }?: { alternative?: string }
  ): {
    type: 'bar' | 'value';
    attribute: string;
    value: number;
    max?: number;
  } | null;

  /**
   * Refresh the display of Token attribute bars, rendering latest resource data
   * If the bar attribute is valid (has a value and max), draw the bar. Otherwise hide it.
   */
  drawBars(): void;

  /**
   * Draw a single resource bar, given provided data
   * @param number - The Bar number
   * @param bar    - The Bar container
   * @param data   - Resource data for this bar
   */
  protected _drawBar(number: number, bar: PIXI.Graphics, data: ReturnType<Token['getBarAttribute']>): void;

  /**
   * Draw the token's nameplate as a text object
   * @returns The Text object for the Token nameplate
   */
  protected _drawNameplate(): PreciseText;

  /**
   * Draw a text tooltip for the token which can be used to display Elevation or a resource value
   */
  drawTooltip(): void;

  /**
   * Return the text which should be displayed in a token's tooltip field
   */
  protected _getTooltipText(): string;

  protected _getTextStyle(): PIXI.TextStyle;

  /**
   * Draw the active effects and overlay effect icons which are present upon the Token
   */
  drawEffects(): Promise<void>;

  /**
   * Draw the overlay effect icon
   */
  protected _drawOverlay({ src, tint }?: { src: string; tint: number }): void;

  /**
   * Draw a status effect icon
   */
  protected _drawEffect(src: string, i: number, bg: PIXI.Graphics, w: number, tint: number): void;

  /**
   * Helper method to determine whether a token attribute is viewable under a certain mode
   * @param mode - The mode from CONST.TOKEN_DISPLAY_MODES
   * @returns Is the attribute viewable?
   */
  protected _canViewMode(mode: number): boolean;

  /**
   * Animate Token movement along a certain path which is defined by a Ray object
   * @param ray - The path along which to animate Token movement
   */
  animateMovement(ray: Ray): Promise<void>;

  /**
   * Animate the continual revealing of Token vision during a movement animation
   */
  protected _onMovementFrame(
    dt: unknown,
    anim: Array<{ context: unknown; name: string | null; duration: number; ontick: unknown }>,
    config: { fog?: boolean; source?: boolean }
  ): void;

  /**
   * Update perception each frame depending on the animation configuration
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

  /** @override */
  clone(): Token;

  /** @override */
  protected _onControl({
    releaseOthers,
    updateSight,
    pan
  }?: {
    releaseOthers?: boolean;
    updateSight?: boolean;
    pan?: boolean;
  }): void;

  /** @override */
  protected _onRelease({ updateSight }?: { updateSight?: boolean }): void;

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
   * @param animate - Animate the movement path, default is true
   * @returns The Token after animation has completed
   */
  setPosition(x: number, y: number, { animate }?: { animate?: boolean }): Promise<this>;

  /**
   * Update the Token velocity auto-regressively, shifting increasing weight towards more recent movement
   * Employ a magic constant chosen to minimize (effectively zero) the likelihood of trigonometric edge cases
   * @param ray - The proposed movement ray
   * @returns An updated velocity with directional memory
   */
  protected _updateVelocity(
    ray: Ray
  ): {
    dx: number;
    sx: number;
    dy: number;
    sy: number;
  };

  /**
   * Set this Token as an active target for the current game User
   * @param targeted       - Is the Token now targeted?
   * @param user           - Assign the token as a target for a specific User
   * @param releaseOthers  - Release other active targets for the same player?
   * @param groupSelection - Is this target being set as part of a group selection workflow?
   */
  setTarget(
    targeted?: boolean,
    { user, releaseOthers, groupSelection }?: { user?: User | null; releaseOthers?: boolean; groupSelection?: boolean }
  ): void;

  /**
   * Add or remove the currently controlled Tokens from the active combat encounter
   * @param combat - A specific combat encounter to which this Token should be added
   * @returns The Token which initiated the toggle
   */
  toggleCombat(combat?: Combat): Promise<this>;

  /**
   * Toggle an active effect by it's texture path.
   * Copy the existing Array in order to ensure the update method detects the data as changed.
   *
   * @param effect  - The texture file-path of the effect icon to toggle on the Token.
   * @param active  - Force a certain active state for the effect
   * @param overlay - Whether to set the effect as the overlay effect?
   * @returns Was the texture applied (true) or removed (false)
   */
  toggleEffect(
    effect: string | ActiveEffect.Data,
    { active, overlay }?: { active?: boolean; overlay?: boolean }
  ): Promise<boolean>;

  /**
   * A helper function to toggle a status effect which includes an Active Effect template
   */
  protected _toggleActiveEffect(effectData: ActiveEffect.Data, { overlay }?: { overlay?: boolean }): Promise<boolean>;

  /**
   * A helper function to toggle the overlay status icon on the Token
   */
  protected _toggleOverlayEffect(texture: string, { active }?: { active: boolean }): Promise<this>;

  /**
   * Toggle the visibility state of any Tokens in the currently selected set
   * @returns A Promise which resolves to the updated Scene
   */
  toggleVisibility(): Promise<Scene>;

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

  /** @override */
  protected _getShiftedPosition(dx: number, dy: number): { x: number; y: number };

  /**
   * Extend the PlaceableObject.rotate method to prevent rotation if the Token is in the midst of a movement animation
   */
  rotate(angle: number, snap: number): Promise<this>;

  /** @override */
  protected _onCreate(options?: unknown, userId?: string): void;

  /** @override */
  protected _onUpdate(data?: DeepPartial<Token.Data>, options?: { animate?: boolean }, userId?: string): void;

  /** @override */
  protected _onDelete(options?: unknown, userId?: string): void;

  /**
   * Handle updates to the Token's referenced Actor (either Entity or synthetic)
   * @param updateData - The changes to Token actorData overrides which are incremental
   */
  protected _onUpdateTokenActor(updateData: DeepPartial<Actor.Data>): void;

  /**
   * Handle updates to this Token which originate from changes to the base Actor entity
   * @param actorData  - Updated data for the base Actor
   * @param updateData - Changes to the base Actor which were incremental
   */
  protected _onUpdateBaseActor(actorData: Actor.Data, updateData: DeepPartial<Actor.Data>): void;

  /**
   * Handle the possible re-drawing of Token attribute bars depending on whether the tracked attribute changed
   * @param updateData - An object of changed data
   */
  protected _onUpdateBarAttributes(updateData: DeepPartial<Actor.Data>): void;

  /** @override */
  protected _canControl(user?: User, event?: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _canHUD(user: User, event?: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _canConfigure(user?: User, event?: PIXI.InteractionEvent): true;

  /** @override */
  protected _canHover(user?: User, event?: PIXI.InteractionEvent): true;

  /** @override */
  protected _canView(user?: User, event?: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _canDrag(user: User, event: PIXI.InteractionEvent): boolean;

  /** @override */
  protected _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers?: boolean }): void;

  /** @override */
  protected _onHoverOut(event: PIXI.InteractionEvent): boolean | void;

  /** @override */
  protected _onClickLeft(event: PIXI.InteractionEvent): boolean | null;

  /** @override */
  protected _onClickLeft2(event?: PIXI.InteractionEvent): void;

  /** @override */
  protected _onClickRight2(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): Promise<any>;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * A factory method to create a Token instance from an Actor entity.
   * The Token is not automatically saved to the database, it is up to the caller whether or not they wish to do that.
   *
   * @param actor     - The input actor entity
   * @param tokenData - Additional data, such as x, y, rotation, etc. for the created token
   * @returns The created Token instance
   */
  static fromActor(actor: Actor, tokenData?: DeepPartial<Token.Data>): Promise<Token>;

  /**
   * @deprecated since 0.7.4
   */
  shiftPosition(dx: number, dy: number): Promise<this>;

  /**
   * @deprecated since 0.7.4
   * @see {@link Token#toggleEffect}
   */
  toggleOverlay(texture: string | ActiveEffect.Data): Promise<boolean>;
}

declare namespace Token {
  interface Data extends PlaceableObject.Data {
    actorData: DeepPartial<Actor.Data>;
    actorId: string;
    actorLink: boolean;
    bar1: Bar;
    bar2: Bar;
    brightLight: number;
    brightSight: number;
    dimLight: number;
    dimSight: number;
    displayBars: foundry.CONST.TokenDisplayMode;
    displayName: foundry.CONST.TokenDisplayMode;
    disposition: foundry.CONST.TokenDisposition;
    effects: Array<unknown>;
    elevation: number;
    height: number;
    hidden: boolean;
    img: string;
    lightAlpha: number;
    lightAngle: number;
    lightAnimation: { type: string; speed: number; intensity: number };
    lightColor: string;
    lockRotation: boolean;
    mirrorX: boolean;
    mirrorY: boolean;
    name: string;
    overlayEffect: string;
    randomImg?: boolean;
    rotation: number;
    scale: number;
    sightAngle: number;
    tint: string;
    vision: boolean;
    width: number;
    x: number;
    y: number;
  }
  interface Bar {
    attribute: string;
  }
}
