import type { IntentionalPartial } from "../../../../types/helperTypes.d.mts";
import type { NullishProps, RequiredProps } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A Token is an implementation of PlaceableObject which represents an Actor within a viewed Scene on the game canvas.
   * @see TokenDocument
   * @see TokenLayer
   */
  class Token<
    ControlOptions extends Token.ControlOptions = Token.ControlOptions,
    DestroyOptions extends Token.DestroyOptions | boolean = Token.DestroyOptions | boolean,
    DrawOptions extends Token.DrawOptions = Token.DrawOptions,
    ReleaseOptions extends Token.ReleaseOptions = Token.ReleaseOptions,
  > extends PlaceableObject<
    TokenDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    static override embeddedName: "Token";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      redrawEffects: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshNameplate", "refreshElevation", "refreshRingVisuals"], alias: true }` */
      refresh: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshVisibility", "refreshTarget"] }` */
      refreshState: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshVisibility: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
      refreshTransform: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshRotation: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshShape", "refreshBars", "refreshEffects", "refreshNameplate", "refreshTarget", "refreshTooltip"] }` */
      refreshSize: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshTooltip"] }` */
      refreshElevation: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshShader"] }` */
      refreshMesh: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshShader: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshVisibility", "refreshPosition", "refreshBorder", "refreshEffects"] }` */
      refreshShape: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshBorder: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshBars: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshEffects: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshNameplate: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshTarget: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshTooltip: RenderFlag<Partial<Token.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshRingVisuals: RenderFlag<Partial<Token.RenderFlags>>;

      /**
       * @deprecated since v12, until v14
       * @defaultValue `{}`
       */
      recoverFromPreview: RenderFlag<Partial<Token.RenderFlags>>;
    };

    /**
     * The shape of this token.
     */
    shape: PIXI.Rectangle | PIXI.Polygon | PIXI.Circle | undefined;

    /**
     * Defines the filter to use for detection.
     */
    detectionFilter: PIXI.Filter | null;

    /**
     * A Graphics instance which renders the border frame for this Token inside the GridLayer.
     */
    border: PIXI.Graphics | undefined;

    /**
     * The effects icons of temporary ActiveEffects that are applied to the Actor of this Token.
     */
    effects: PIXI.Container | undefined;

    /**
     * The attribute bars of this Token.
     */
    bars: PIXI.Container | undefined;

    /**
     * The tooltip text of this Token, which contains its elevation.
     */
    tooltip: PreciseText | undefined;

    /**
     * The nameplate of this Token, which displays its name.
     */
    nameplate: PreciseText | undefined;

    /**
     * Track the set of User documents which are currently targeting this Token
     */
    targeted: Set<User.ConfiguredInstance>;

    /**
     * A reference to the SpriteMesh which displays this Token in the PrimaryCanvasGroup.
     */
    mesh: PrimarySpriteMesh | undefined;

    /**
     * Renders the mesh of this Token with ERASE blending in the Token.
     */
    voidMesh: PIXI.DisplayObject | undefined;

    /**
     * Renders the mesh of with the detection filter.
     */
    detectionFilterMesh: PIXI.DisplayObject | undefined;

    /**
     * The texture of this Token, which is used by its mesh.
     */
    texture: PIXI.Texture | undefined;

    /**
     * A reference to the VisionSource object which defines this vision source area of effect
     */
    vision: foundry.canvas.sources.PointVisionSource.Any | undefined;

    /**
     * A reference to the LightSource object which defines this light source area of effect
     */
    light: foundry.canvas.sources.PointLightSource | undefined;

    /**
     * The current animations of this Token.
     */
    get animationContexts(): Map<string, Token.AnimationContext>;

    /**
     * A TokenRing instance which is used if this Token applies a dynamic ring.
     * This property is null if the Token does not use a dynamic ring.
     */
    get ring(): foundry.canvas.tokens.TokenRing | null;

    /**
     * A convenience boolean to test whether the Token is using a dynamic ring.
     */
    get hasDynamicRing(): boolean;

    /**
     * A convenient reference to the Actor object associated with the Token embedded document.
     */
    get actor(): Actor.ConfiguredInstance | null;

    /**
     * A boolean flag for whether the current game User has observer permission for the Token
     */
    get observer(): boolean;

    /**
     * Convenience access to the token's nameplate string
     */
    get name(): string;

    override get bounds(): PIXI.Rectangle;

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
    get center(): PIXI.Point;

    /**
     * The Token's central position, adjusted in each direction by one or zero pixels to offset it relative to walls.
     */
    getMovementAdjustedPoint(
      point: Canvas.Point,
      offset?: NullishProps<{ offsetX: number; offsetY: number }>,
    ): Canvas.Point;

    /**
     * The HTML source element for the primary Tile texture
     */
    get sourceElement(): HTMLImageElement | HTMLVideoElement | undefined;

    override get sourceId(): string;

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
    get combatant(): Combatant.ConfiguredInstance | null;

    /**
     * An indicator for whether the Token is currently targeted by the active game User
     */
    get isTargeted(): boolean;

    /**
     * Return a reference to the detection modes array.
     */
    get detectionModes(): DetectionMode[];

    /**
     * Determine whether the Token is visible to the calling user's perspective.
     * Hidden Tokens are only displayed to GM Users.
     * Non-hidden Tokens are always visible if Token Vision is not required.
     * Controlled tokens are always visible.
     * All Tokens are visible to a GM user if no Token is controlled.
     *
     * @see {@link CanvasVisibility#testVisibility}
     */
    get isVisible(): boolean;

    /**
     * The animation name used for Token movement
     */
    get animationName(): string;

    /**
     * Test whether the Token has sight (or blindness) at any radius
     */
    get hasSight(): boolean;

    /**
     * Does this Token actively emit light given its properties and the current darkness level of the Scene?
     */
    protected _isLightSource(): boolean;

    /**
     * Does this Ambient Light[sic] actively emit darkness given
     * its properties and the current darkness level of the Scene?
     * @remarks The above error is in the Foundry JSDoc; clearly they meant Token.
     */
    get emitsDarkness(): boolean;

    /**
     * Does this Ambient Light[sic] actively emit light given
     * its properties and the current darkness level of the Scene?
     * @remarks The above error is in the Foundry JSDoc; clearly they meant Token.
     */
    get emitsLight(): boolean;

    /**
     * Test whether the Token uses a limited angle of vision or light emission.
     */
    get hasLimitedSourceAngle(): boolean;

    /**
     * Translate the token's dim light distance in units into a radius in pixels.
     */
    get dimRadius(): number;

    /**
     * Translate the token's bright light distance in units into a radius in pixels.
     */
    get brightRadius(): number;

    /**
     * The maximum radius in pixels of the light field
     */
    get radius(): number;

    /**
     * The range of this token's light perception in pixels.
     */
    get lightPerceptionRange(): number;

    /**
     * Translate the token's vision range in units into a radius in pixels.
     */
    get sightRange(): number;

    /**
     * Translate the token's maximum vision range that takes into account lights.
     */
    get optimalSightRange(): number;

    /**
     * Update the light and vision source objects associated with this Token.
     * @param options - Options which configure how perception sources are updated
     */
    initializeSources(
      options?: NullishProps<{
        /**
         * Indicate that this light and vision source has been deleted
         * @defaultValue `false`
         */
        deleted: boolean;
      }>,
    ): void;

    /**
     * Update an emitted light source associated with this Token.
     * @param options - Options which affect how the light source is updated
     */
    initializeLightSource(
      options?: NullishProps<{
        /**
         * Indicate that this light source has been deleted.
         * @defaultValue `false`
         */
        deleted: boolean;
      }>,
    ): void;

    //TODO: reevaluate after auditing the _Source classes
    /**
     * Get the light source data.
     */
    protected _getLightSourceData(): PlaceableObject.ExtendedLightSourceData;

    /**
     * Update the VisionSource instance associated with this Token.
     * @param options - Options which affect how the vision source is updated
     */
    initializeVisionSource(
      options?: NullishProps<{
        /**
         * Indicate that this vision source has been deleted.
         * @defaultValue `false`
         */
        deleted: boolean;
      }>,
    ): void;

    /**
     * Returns a record of blinding state.
     */
    protected _getVisionBlindedStates(): Record<string, boolean>;

    /**
     * Get the vision source data.
     * @remarks IntentionalPartial because while it contains all the keys of the Foundry typedef for VisionSourceData (which this is set as returning in their types)
     * and more, it omits `animation` and `walls` keys at least from our - more accurate - interface
     */
    protected _getVisionSourceData(): IntentionalPartial<foundry.canvas.sources.PointVisionSource.VisionSourceData>;

    // TODO(LukeAbby): This override appears to fail because it creates a circular dependency that tsc can't resolve for some reason. Bug report?
    // `Token` is a `PlaceableObject` if it properly extends `PlaceableObject` however `clone` is a proper override of `PlaceableObject.clone` only if its return value extends `PlaceableObject`.
    // This creates a loop of checking `Token` against `PlaceableObject`.
    // override clone(): Token;

    /**
     * Update the light and vision source objects associated with this Token
     * @param options - Options which configure how perception sources are updated
     */
    updateSource(options?: Token.UpdateSourceOptions): void;

    /**
     * Update an emitted light source associated with this Token.
     * @param options - (default `{}`)
     */
    updateLightSource(options?: Token.UpdateLightSourceOptions): void;

    /**
     * Update an Token vision source associated for this token.
     * @param options - Options which affect how the vision source is updated
     *                  (default: `{}`)
     */
    updateVisionSource(options?: Token.UpdateVisionSourceOptions): void;

    /**
     * Test whether this Token is a viable vision source for the current User
     * @internal
     */
    protected _isVisionSource(): boolean;

    override render(renderer: PIXI.Renderer): void;

    /**
     * Render the bound mesh detection filter.
     * Note: this method does not verify that the detection filter exists.
     */
    protected _renderDetectionFilter(renderer: PIXI.Renderer): void;

    override clear(): void;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _applyRenderFlags(flags: Token.RenderFlags): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    /**
     * Refresh the text content, position, and visibility of the Token nameplate.
     */
    protected _refreshNameplate(): void;

    /**
     * Refresh the token mesh.
     */
    protected _refreshMesh(): void;

    /**
     * Refresh the token mesh shader.
     */
    protected _refreshShader(): void;

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
    protected _getBorderColor(options?: {
      /**
       * Return a border color for this hover state, otherwise use the token's current state.
       */
      hover?: boolean;
    }): number | null;

    /**
     * Refresh the target indicators for the Token.
     * Draw both target arrows for the primary User and indicator pips for other Users targeting the same Token.
     * @param reticule - Additional parameters to configure how the targeting reticule is drawn.
     */
    protected _refreshTarget(reticule?: Token.ReticuleOptions): void;

    /**
     * Draw the targeting arrows around this token.
     * @param reticule - Additional parameters to configure how the targeting reticule is drawn.
     */
    protected _drawTarget(reticule?: Token.ReticuleOptions): void;

    /**
     * Refresh the display of Token attribute bars, rendering its latest resource data.
     * If the bar attribute is valid (has a value and max), draw the bar. Otherwise hide it.
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
     * Return the text which should be displayed in a token's tooltip field
     */
    protected _getTooltipText(): string;

    /**
     * Get the text style that should be used for this Token's tooltip.
     */
    protected _getTextStyle(): PIXI.TextStyle;

    /**
     * Draw the active effects and overlay effect icons which are present upon the Token
     */
    drawEffects(): Promise<void>;

    /**
     * Draw a status effect icon
     */
    protected _drawEffect(src: string, tint: number | null): Promise<PIXI.Sprite | undefined>;

    /**
     * Draw the overlay effect icon
     */
    protected _drawOverlay(src: string, tint: number | null): Promise<PIXI.Sprite>;

    /**
     * Refresh the display of status effects, adjusting their position for the token width and height.
     */
    protected _refreshEffects(): void;

    /**
     * Helper method to determine whether a token attribute is viewable under a certain mode
     * @param mode - The mode from CONST.TOKEN_DISPLAY_MODES
     * @returns Is the attribute viewable?
     */
    protected _canViewMode(mode: foundry.CONST.TOKEN_DISPLAY_MODES): boolean;

    /**
     * Animate changes to the appearance of the Token.
     * Animations are performed over differences between the TokenDocument and the current Token and TokenMesh appearance.
     * @param updateData - A record of the differential data which changed, for reference only
     * @param options    - Options which configure the animation behavior
     * @returns A promise which resolves once the animation is complete
     */
    animate(
      updateData: unknown,
      options: {
        /** An optional function called each animation frame */
        ontick: (dt: number, data: CanvasAnimationData) => number;

        /**
         * A desired token movement speed in grid spaces per second
         * @defaultValue `6`
         */
        movementSpeed: number;

        /**
         * The animation starting attributes if different from those cached.
         *
         * @deprecated since v12, will be removed in v14
         */
        a0: unknown;
      },
    ): Promise<void>;

    /**
     * Terminate animation of this particular Token.
     */
    stopAnimation(): void;

    /**
     * Check for collision when attempting a move to a new position
     * @param destination - The central destination point of the attempted movement
     * @param options     - Additional options forwarded to WallsLayer#checkCollision
     * @returns The result of the WallsLayer#checkCollision test
     */
    checkCollision(
      destination: Canvas.Point,
      options: {
        origin: Canvas.Point;

        /** @defaultValue `"move"` */
        type: Exclude<Token.SourceType, "Sound">;

        /** @defaultValue `"any"` */
        mode: PointSourcePolygon.CollisionModes;
      },
    ): boolean;
    /**
     * Get the center-point coordinate for a given grid position
     * @param x - The grid x-coordinate that represents the top-left of the Token
     * @param y - The grid y-coordinate that represents the top-left of the Token
     * @returns The coordinate pair which represents the Token's center at position (x, y)
     */
    getCenter(
      x: number,
      y: number,
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
    setTarget(targeted?: boolean, context?: Token.SetTargetContext): void;

    /**
     * Add or remove the currently controlled Tokens from the active combat encounter
     * @param combat - A specific combat encounter to which this Token should be added
     * @returns The Token which initiated the toggle
     */
    toggleCombat(combat?: Combat.ConfiguredInstance): Promise<this>;

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
      effect: string | Parameters<TokenDocument["toggleActiveEffect"]>[0],
      options?: Token.EffectToggleOptions,
    ): Promise<boolean>;

    /**
     * Toggle the visibility state of any Tokens in the currently selected set
     * @returns A Promise which resolves to the updated Token documents
     */
    toggleVisibility(): Promise<TokenDocument.ConfiguredInstance[]>;

    /**
     * The external radius of the token in pixels.
     */
    get externalRadius(): number;

    /**
     * A generic transformation to turn a certain number of grid units into a radius in canvas pixels.
     * This function adds additional padding to the light radius equal to the external radius of the token.
     * This causes light to be measured from the outer token edge, rather than from the center-point.
     * @param units - The radius in grid units
     * @returns The radius in pixels
     */
    getLightRadius(units: number): number;

    protected override _getShiftedPosition(dx: number, dy: number): { x: number; y: number };

    /**
     * @privateRemarks _onDelete and _onUpdate are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Handle changes to Token behavior when a significant status effect is applied
     * @param statusId - The status effect ID being applied, from CONFIG.specialStatusEffects
     * @param active   - Is the special status effect now active?
     * @internal
     */
    _onApplyStatusEffect(statusId: string, active: boolean): void;

    protected override _onControl(options?: Token.ControlOptions): void;

    protected override _onRelease(
      options: PlaceableObject.ReleaseOptions,
    ): Promise<TokenDocument.ConfiguredInstance> | undefined;

    protected override _canControl(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canHUD(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): true;

    protected override _canHover(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): true;

    protected override _canView(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canDrag(user: User.ConfiguredInstance, event: PIXI.FederatedEvent): boolean;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: { hoverOutOthers?: boolean }): void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): false | void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft2(event?: PIXI.FederatedEvent): void;

    protected override _onClickRight2(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): Promise<any>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragEnd(): void;

    /**
     * @remarks Not used
     */
    controlIcon: null;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks `"Token#getSightOrigin has been deprecated in favor of Token#getMovementAdjustedPoint"`
     */
    getSightOrigin(): {
      x: number;
      y: number;
    };

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks `"Token#icon has been renamed to Token#mesh."`
     */
    get icon(): this["mesh"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"Token#updatePosition has been deprecated without replacement as it is no longer required."`
     */
    updatePosition(): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "Token#refreshHUD is deprecated in favor of token.renderFlags.set()"
     */
    refreshHUD(options?: Token.ObjectHUD): void;

    /**
     * A convenient reference for whether the current User has full control over the Token document.
     * @deprecated since v12, until v14
     * @remarks "Token#owner has been deprecated. Use Token#isOwner instead."
     */
    get owner(): boolean;
  }

  namespace Token {
    type AnyConstructor = typeof AnyToken;

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Token>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface RenderFlags extends PlaceableObject.RenderFlags {
      redrawEffects: boolean;

      refreshVisibility: boolean;

      refreshTransform: boolean;

      refreshPosition: boolean;

      refreshRotation: boolean;

      refreshSize: boolean;

      refreshElevation: boolean;

      refreshMesh: boolean;

      refreshShader: boolean;

      refreshShape: boolean;

      refreshBorder: boolean;

      refreshBars: boolean;

      refreshEffects: boolean;

      refreshNameplate: boolean;

      refreshTarget: boolean;

      refreshTooltip: boolean;

      refreshRingVisuals: boolean;

      /** @deprecated since v12 Stable 4, until v14 */
      recoverFromPreview: boolean;
    }

    interface AnimationData {
      /** The x position in pixels */
      x: number;

      /** The x position in pixels */
      y: number;

      /** The width in grid spaces */
      width: number;

      /** The height in grid spaces */
      height: number;

      /** The alpha value */
      alpha: number;

      /** The rotation in degrees */
      rotation: number;

      /** The texture data */
      texture: {
        /** The texture file path */
        src: string;

        /** The texture anchor X*/
        anchorX: number;

        /** The texture anchor Y*/
        anchorY: number;

        /** The texture scale X*/
        scaleX: number;

        /** The texture scale Y*/
        scaleY: number;

        /** The texture tint*/
        tint: Color;
      };

      /** The ring data */
      ring: {
        /** The ring subject data */
        subject: {
          /** The ring subject texture */
          texture: string;

          /** The ring subject scale */
          scale: number;
        };
      };
    }

    interface AnimationContext {
      /** The name of the animation */
      name: string | symbol;

      //todo: find out if this can be InexactPartial (NullishProps unlikely)
      /** The final animation state */
      to: IntentionalPartial<AnimationData>;

      /** The duration of the animation */
      duration: number;

      /** The current time of the animation */
      time: number;

      /** Asynchronous functions that are executed before the animation starts */
      preAnimate: ((context: AnimationContext) => Promise<void>)[];

      /**
       * Synchronous functions that are executed after the animation ended.
       * They may be executed before the preAnimate functions have finished  if the animation is terminated.
       */
      postAnimate: ((context: AnimationContext) => void)[];

      /** Synchronous functions that are executed each frame after `ontick` and before {@link Token#_onAnimationUpdate} */
      onAnimate: ((context: AnimationContext) => void)[];

      /**
       * The promise of the animation, which resolves to true if the animation
       * completed, to false if it was terminated, and rejects if an error occurred.
       * Undefined in the first frame (at time 0) of the animation.
       */
      promise: Promise<boolean> | undefined;
    }

    interface ReticuleOptions {
      /**
       * The amount of margin between the targeting arrows and the token's bounding box, expressed as a fraction of an arrow's size.
       * @defaultValue `0`
       */
      margin?: number;

      /**
       * The alpha value of the arrows.
       * @defaultValue `1`
       */
      alpha?: number;

      /**
       * The size of the arrows as a proportion of grid size.
       * @defaultValue `0.15`
       */
      size?: number;

      /**
       * The color of the arrows.
       * @defaultValue `0xFF6400`
       */
      color?: number;

      /** The arrows' border style configuration. */
      border?: {
        /**
         * The border color.
         * @defaultValue `0`
         */
        color?: number;

        /**
         * The border width.
         * @defaultValue `2`
         */
        width?: number;
      };
    }

    type SourceType = "move" | "sight" | "light" | "sound";

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
       * Defer updating perception to manually update it later.
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
       * Defer updating perception to manually update it later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this vision source has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;
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
      user?: User.ConfiguredInstance | null | undefined;

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

    interface ControlOptions extends PlaceableObject.ControlOptions {
      /** @defaultValue `false` */
      pan?: boolean;
    }
  }

  /**
   * A "secret" global to help debug attributes of the currently controlled Token.
   * This is only for debugging, and may be removed in the future, so it's not safe to use.
   */
  let _token: Token.ConfiguredInstance | null;
}

declare abstract class AnyToken extends Token {
  constructor(arg0: never, ...args: never[]);
}
