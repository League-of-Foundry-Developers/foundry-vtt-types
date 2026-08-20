import type {
  Coalesce,
  DeepPartial,
  FixedInstanceType,
  HandleEmptyObject,
  InexactPartial,
  IntentionalPartial,
  RequiredProps,
} from "#utils";
import type { PlaceableObject, Region } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { Canvas, sources } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { PreciseText } from "#client/canvas/containers/_module.mjs";
import type { TextureTransitionFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { BaseTokenRuler, TokenRing, TokenTurnMarker } from "#client/canvas/placeables/tokens/_module.d.mts";
import type { PrimarySpriteMesh } from "#client/canvas/primary/_module.d.mts";
import type { LightData } from "#client/data/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Token: Token.Implementation;
    }
  }
}

/**
 * A Token is an implementation of PlaceableObject which represents an {@linkcode foundry.documents.Actor} within a viewed
 * Scene on the game canvas.
 * @see {@linkcode foundry.documents.TokenDocument}
 * @see {@linkcode foundry.canvas.layers.TokenLayer}
 */
declare class Token extends PlaceableObject<TokenDocument.Implementation> {
  /**
   * @param document - The TokenDocument that this Token represents
   */
  constructor(document: TokenDocument.Implementation);

  // fake type override
  static override get implementation(): Token.ImplementationClass;

  static override embeddedName: "Token";

  static override RENDER_FLAGS: Token.RENDER_FLAGS;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<Token.RENDER_FLAGS>;

  // fake override; super has to type as if this could be a ControlIcon, but Tokens don't use one
  override controlIcon: null;

  /**
   * The shape of this token.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to {@link Token._refreshShape | `Token#_refreshShape`} being called.
   */
  shape: PIXI.Rectangle | PIXI.Polygon | PIXI.Circle | PIXI.Ellipse | undefined;

  /**
   * Defines the filter to use for detection.
   * @defaultValue `null`
   * @remarks Only set to other-than-`null` externally, in {@linkcode CanvasVisibility.testVisibility | CanvasVisibility#testVisibility}
   *
   * Set `null` unconditionally when {@linkcode Token.isVisible | Token#isVisible} is accessed
   */
  detectionFilter: PIXI.Filter | null;

  /**
   * A Graphics instance which renders the border frame for this Token inside the GridLayer.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  border: PIXI.Graphics | undefined;

  /**
   * The effects icons of temporary ActiveEffects that are applied to the Actor of this Token.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  effects: PIXI.Container | undefined;

  /**
   * The attribute bars of this Token.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  bars: Token.Bars | undefined;

  /**
   * The tooltip text of this Token, which contains its elevation.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  tooltip: PreciseText | undefined;

  /**
   * The indicator for "this token is not in the viewed level".
   * @defaultValue `undefined`
   */
  levelIndicator: PIXI.Sprite | undefined;

  /**
   * The target arrows marker, which indicates that this Token is targeted by this User.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  targetArrows: PIXI.Graphics | undefined;

  /**
   * The target pips marker, which indicates that this Token is targeted by other User(s).
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  targetPips: PIXI.Graphics | undefined;

  /**
   * The nameplate of this Token, which displays its name.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  nameplate: PreciseText | undefined;

  /**
   * The ruler of this Token.
   * @defaultValue `undefined`
   * @remarks `undefined` prior to first draw; `null` if `CONFIG.Token.rulerClass` is not set.
   */
  ruler: BaseTokenRuler | null | undefined;

  /**
   * The ruler data.
   * @defaultValue `{}`
   */
  protected _plannedMovement: Record<string, Token.PlannedMovement>;

  /**
   * Track the set of User documents which are currently targeting this Token
   */
  targeted: Set<User.Stored>;

  /**
   * A reference to the SpriteMesh which displays this Token in the PrimaryCanvasGroup.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  mesh: PrimarySpriteMesh | undefined;

  /**
   * Renders the mesh of this Token with ERASE blending in the Token.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  voidMesh: PIXI.Container | undefined;

  /**
   * Renders the mesh of with the detection filter.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  detectionFilterMesh: PIXI.Container | undefined;

  /**
   * The texture of this Token, which is used by its mesh.
   * @defaultValue `undefined`
   * @remarks `undefined` prior to first draw or after {@linkcode Token._destroy | Token#_destroy} is called
   */
  texture: PIXI.Texture | undefined;

  /**
   * A reference to the VisionSource object which defines this vision source area of effect.
   * This is undefined if the Token does not provide an active source of vision.
   * @defaultValue `undefined`
   * @remarks `undefined` prior to first draw or after {@linkcode Token._destroy | Token#_destroy} is called, or
   * {@linkcode Token.initializeVisionSource | Token#initializeVisionSource} is called with `{deleted: true}`
   */
  vision: sources.PointVisionSource.Implementation | undefined;

  /**
   * Vision version incremented each time vision (and light) are updated.
   * @defaultValue `0`
   * @internal
   */
  _visionSourceVersion: number;

  /**
   * A reference to the LightSource object which defines this light source area of effect.
   * This is undefined if the Token does not provide an active source of light.
   * @defaultValue `undefined`
   * @remarks `undefined` prior to first draw or after {@linkcode Token._destroy | Token#_destroy} is called, or
   * {@linkcode Token.initializeLightSource | Token#initializeLightSource} is called with `{deleted: true}`
   *
   * Whether this is a LightSource or a DarknessSource depends on `this.document.light.negative`
   */
  light: sources.PointLightSource.Implementation | sources.PointDarknessSource.Implementation | undefined;

  /**
   * The Turn Marker of this Token.
   * Only a subset of Token objects have a turn marker at any given time.
   * @defaultValue `null`
   */
  turnMarker: TokenTurnMarker | null;

  /**
   * The current animations of this Token.
   */
  get animationContexts(): Map<string, Token.AnimationContext>;

  /**
   * The general animation name used for this Token.
   * @defaultValue
   * ```js
   * `${this.objectId}.animate`
   * ```
   */
  get animationName(): string;

  /**
   * The animation name used to animate this Token's movement.
   */
  get movementAnimationName(): string;

  /**
   * The promise of the current movement animation chain of this Token
   * or null if there isn't a movement animation in progress.
   */
  get movementAnimationPromise(): Promise<void> | null;

  /**
   * Should the ruler of this Token be visible?
   */
  get showRuler(): boolean;

  /**
   * Prevent keyboard movement of this Token?
   * @defaultValue `false`
   * @internal
   */
  _preventKeyboardMovement: boolean;

  /**
   * A TokenRing instance which is used if this Token applies a dynamic ring.
   * This property is null if the Token does not use a dynamic ring.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw. Set `null` if `token.document.ring.enabled` is `false`.
   */
  get ring(): TokenRing.Implementation | null | undefined;

  /**
   * A convenience boolean to test whether the Token is using a dynamic ring.
   */
  get hasDynamicRing(): boolean;

  /**
   * A convenient reference to the Actor object associated with the Token embedded document.
   */
  get actor(): TokenDocument.Implementation["actor"];

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

  override get center(): PIXI.Point;

  /**
   * The HTML source element for the primary Tile texture
   * @privateRemarks Foundry types this as `HTMLImageElement | HTMLVideoElement`, but this just
   * returns `this.texture?.baseTexture.resource.source`, which could be any of `PIXI.ImageSource`,
   * and returns `ImageBitmap`, not `HTMLImageElement`, for static images.
   */
  get sourceElement(): PIXI.ImageSource | null;

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
  get combatant(): Combatant.Stored | null;

  /**
   * An indicator for whether the Token is currently targeted by the active game User
   */
  get isTargeted(): boolean;

  /**
   * Is this Token currently being dragged?
   */
  get isDragged(): boolean;

  /**
   * Return a reference to the detection modes array.
   */
  get detectionModes(): TokenDocument.Implementation["detectionModes"];

  /**
   * Determine whether the Token is visible to the calling user's perspective.
   * Hidden Tokens are only displayed to GM Users.
   * Non-hidden Tokens are always visible if Token Vision is not required.
   * Controlled tokens are always visible.
   * All Tokens are visible to a GM user if no Token is controlled.
   *
   * @see {@linkcode CanvasVisibility.testVisibility | CanvasVisibility#testVisibility}
   */
  get isVisible(): boolean;

  /**
   * Test if this Token should be culled.
   */
  protected _testCulled(): boolean;

  override get isInteractable(): boolean;

  /**
   * Test whether the Token has sight (or blindness) at any radius
   */
  get hasSight(): boolean;

  /**
   * Does this Token actively emit light given its properties and the current darkness level of the Scene?
   */
  protected _isLightSource(): boolean;

  /**
   * Does this token actively emit darkness given its properties and the current darkness level of the Scene?
   */
  get emitsDarkness(): boolean;

  /**
   * Does this token actively emit light given its properties and the current darkness level of the Scene?
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
  initializeSources(options?: Token.InitializeSourcesOptions): void;

  /**
   * Update an emitted light source associated with this Token.
   */
  initializeLightSource(options?: Token.InitializeSourcesOptions): void;

  /**
   * Get the light source data.
   */
  protected _getLightSourceData(): Token.LightSourceData;

  /**
   * Update the VisionSource instance associated with this Token.
   * @param options - Options which affect how the vision source is updated
   */
  initializeVisionSource(options?: Token.InitializeSourcesOptions): void;

  /**
   * Returns a record of blinding state.
   */
  protected _getVisionBlindedStates(): Token.BlindedStates;

  /**
   * Get the vision source data.
   */
  protected _getVisionSourceData(): Token.VisionSourceData;

  /**
   * Test whether this Token is a viable vision source for the current User.
   */
  protected _isVisionSource(): boolean;

  /**
   * Test whether this Token should contribute to shared Fog of War exploration.
   */
  protected _isFogExplorationSource(): boolean;

  /**
   * Plan a movement for this Token.
   * @param options - Additional options.
   * @returns The planned movement ID, origin, destination, and waypoints, or null if the dismiss key was pressed,
   * the Token was released, the game was paused and the user is not a GM, or the Token is locked.
   * @see {@linkcode TokenDocument.startMovement | TokenDocument#startMovement}
   * @example
   * ```js
   * const plan = await token.planMovement({
   *   allowedActions: ["blink"],
   *   direct: true,
   *   maxDistance: 30,
   *   preventDrop: true
   * });
   * if ( !plan ) return;
   * await token.document.startMovement(plan.id);
   * ```
   */
  planMovement(options?: Token.PlanMovementOptions): Promise<Token.PlanMovementResult | null>;

  /**
   * Render the bound mesh detection filter.
   * Note: this method does not verify that the detection filter exists.
   */
  protected _renderDetectionFilter(renderer: PIXI.Renderer): void;

  protected override _clear(): void;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  protected override _draw(options: HandleEmptyObject<Token.DrawOptions> | undefined): Promise<void>;

  /**
   * Create the BaseTokenRuler instance for this Token, if any.
   * This function is called when the Token is drawn for the first time.
   */
  protected _initializeRuler(): BaseTokenRuler | null;

  /**
   * Create an unattached VisionSource instance used for shared fog exploration.
   * @internal
   */
  _createSharedFogVisionSource(): sources.PointVisionSource.Implementation;

  protected override _applyRenderFlags(flags: Token.RenderFlags): void;

  /**
   * Refresh the token ring visuals if necessary.
   */
  protected _refreshRingVisuals(): void;

  protected override _refreshVisibility(): void;

  protected override _refreshState(): void;

  /**
   * Resize mesh and handle scale adjustment.
   */
  protected _refreshMeshSizeAndScale(): void;

  /**
   * Refresh the size.
   */
  protected _refreshSize(): void;

  /**
   * Refresh the token mesh.
   */
  protected _refreshMesh(): void;

  /**
   * Refresh the shape.
   */
  protected _refreshShape(): void;

  /**
   * Refresh the rotation.
   */
  protected _refreshRotation(): void;

  /**
   * Refresh the position.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the elevation
   */
  protected _refreshElevation(): void;

  /**
   * Refresh the tooltip.
   */
  protected _refreshTooltip(): void;

  /**
   * Refresh the text content, position, and visibility of the Token nameplate.
   */
  protected _refreshNameplate(): void;

  /**
   * Refresh the token mesh shader.
   */
  protected _refreshShader(): void;

  /**
   * Refresh the border.
   */
  protected _refreshBorder(): void;

  /**
   * Configure bespoke bar colors for a given bar. If this method is not implemented, the default colors from
   * CONFIG.Token.barConfig will be used.
   * @param index - The bar index.
   * @param data  - Resource data for the base.
   */
  protected _getBarColors(index: number, data: NonNullable<TokenDocument.GetBarAttributeReturn>): Token.BarColors;

  /**
   * Get the hex color that should be used to render the Token border
   * @returns The hex color used to depict the border color
   * @remarks Border colors set via `CONFIG.Canvas.dispositionColors`
   */
  protected _getBorderColor(): number;

  /**
   * Get the Color used to represent the disposition of this Token.
   */
  getDispositionColor(): number;

  /**
   * Refresh the target indicators for the Token.
   * Draw both target arrows for the primary User and indicator pips for other Users targeting the same Token.
   * @remarks Forwards to {@link Token._drawTargetArrows | `Token#_drawTargetArrows`} and
   * {@link Token._drawTargetPips | `Token#_drawTargetPips`}
   */
  protected _refreshTarget(): void;

  /**
   * Draw the targeting arrows around this token.
   * @param reticule - Additional parameters to configure how the targeting reticule is drawn. (default: `{}`)
   */
  protected _drawTargetArrows(reticule?: Token.ReticuleOptions): void;

  /**
   * Draw the targeting pips around this token.
   */
  protected _drawTargetPips(): void;

  /**
   * Refresh the display of Token attribute bars, rendering its latest resource data.
   * If the bar attribute is valid (has a value and max), draw the bar. Otherwise hide it.
   */
  drawBars(): void;

  /**
   * Draw a single resource bar, given provided data
   * @param index - The Bar index
   * @param bar   - The Bar container
   * @param data  - Resource data for this bar
   */
  protected _drawBar(index: number, bar: PIXI.Graphics, data: NonNullable<TokenDocument.GetBarAttributeReturn>): void;

  /**
   * Return the text which should be displayed in a token's tooltip field.
   */
  protected _getTooltipText(): string;

  /**
   * Get the text style that should be used for this Token's tooltip.
   */
  protected _getTextStyle(): PIXI.TextStyle;

  /**
   * Draw the effect icons for ActiveEffect documents which apply to the Token's Actor.
   */
  drawEffects(): Promise<this>;

  /**
   * Draw the effect icons for ActiveEffect documents which apply to the Token's Actor.
   * Called by {@linkcode Token.drawEffects | Token#drawEffects}.
   */
  protected _drawEffects(): Promise<void>;

  /**
   * Draw a status effect icon
   * @remarks Returns early if `src` is falsey, but otherwise calls {@linkcode loadTexture} with `{ fallback: "icons/svg/hazard.svg" }` and returns that.
   *
   * A nullish `tint` is treated as `0xFFFFFF`.
   */
  protected _drawEffect(src: string, tint?: PIXI.ColorSource | null): Promise<PIXI.Sprite | undefined>;

  /**
   * Draw the overlay effect icon
   * @remarks Forwards both arguments to {@linkcode Token._drawEffect | Token#_drawEffect}, and returns its output.
   */
  protected _drawOverlay(src: string, tint?: number | null): Promise<PIXI.Sprite | undefined>;

  /**
   * Refresh the display of status effects, adjusting their position for the token width and height.
   */
  protected _refreshEffects(): void;

  /**
   * Refresh presentation of the Token's combat turn marker, if any.
   */
  protected _refreshTurnMarker(): void;

  /**
   * Refresh the display of the ruler.
   */
  protected _refreshRuler(): void;

  /**
   * Helper method to determine whether a token attribute is viewable under a certain mode
   * @param mode - The mode from {@linkcode CONST.TOKEN_DISPLAY_MODES}
   * @returns Is the attribute viewable?
   */
  protected _canViewMode(mode: CONST.TOKEN_DISPLAY_MODES): boolean;

  /**
   * Override ring colors for this particular Token instance.
   * @remarks The return gets `mergeObject`ed over {@linkcode TokenDocument.ring | TokenDocument#ring#colors}
   * in {@linkcode TokenRing.configureVisuals | TokenRing#configureVisuals} and
   * {@linkcode TokenRing.flashColor | TokenRing#flashColor}. Foundry's implementation returns `{}`
   */
  getRingColors(): Token.RingColors;

  /**
   * Apply additional ring effects for this particular Token instance.
   * Effects are returned as an array of integers in {@linkcode TokenRing.effects}.
   * @remarks Additional effects to add over and above those in `CONFIG.Token.ring.effects`. Foundry's implementation returns `[]`
   */
  getRingEffects(): TokenRing.EFFECTS[];

  /**
   * Get the animation data for the current state of the document.
   * @returns The target animation data object
   */
  protected _getAnimationData(): Token.AnimationData;

  /**
   * Animate from the old to the new state of this Token.
   * @param to      - The animation data to animate to
   * @param options - The options that configure the animation behavior
   * @returns A promise which resolves once the animation has finished or stopped
   */
  animate(to: Token.PartialAnimationData, options?: Token.AnimateOptions): Promise<void>;

  /**
   * Get the duration of the animation.
   * @param from    - The animation data to animate from
   * @param to      - The animation data to animate to
   * @param options - The options that configure the animation behavior
   * @returns The duration of the animation in milliseconds
   */
  protected _getAnimationDuration(
    from: Token.AnimationDataForDuration,
    to: Token.PartialAnimationData,
    options?: Token.GetAnimationDurationOptions,
  ): number;

  /**
   * Get the base movement speed for the animation in grid size per second.
   * The default implementation returns `CONFIG.Token.movement.defaultSpeed`.
   * @param options - The options that configure the animation behavior
   * @returns The base movement speed for the animation in grid size per second
   */
  protected _getAnimationMovementSpeed(options: Token.AnimateOptions): number;

  /**
   * Modify the base movement speed of the animation.
   * Divides by the terrain difficulty, if present, by default.
   * @param speed   - The base movement speed in grid size per second
   * @param options - The options that configure the animation behavior
   * @returns The modified movement speed in grid size per second
   */
  protected _modifyAnimationMovementSpeed(speed: number, options: Token.AnimateOptions): number;

  /**
   * Configure the animation movement speed based on the given animation duration.
   * @param operation - The update operation
   * @param origin    - The origin
   * @param waypoints - The candidante waypoints
   * @param document  - The token document
   * @internal
   */
  static _configureAnimationMovementSpeed(
    operation: TokenDocument.Database.UpdateOperation,
    origin: TokenDocument.Position,
    waypoints: TokenDocument.MovementWaypoint[],
    document: TokenDocument.Implementation,
  ): void;

  /**
   * Get the rotation speed for the animation in 60 degrees per second.
   * Returns the movement speed by default.
   * @param options - The options that configure the animation behavior
   * @returns The rotation speed in 60 degrees per second
   */
  protected _getAnimationRotationSpeed(options: Token.AnimateOptions): number;

  /**
   * Does this Token require rotation changes to be animated?
   * If false is returned, the rotation speed is set to infinity.
   */
  protected _requiresRotationAnimation(): boolean;

  /**
   * Called each animation frame.
   * @param changed - The animation data that changed
   * @param context - The animation context
   */
  protected _onAnimationUpdate(changed: Token.PartialAnimationData, context: Token.AnimationContext): void;

  /**
   * Terminate the animations of this particular Token, if exists.
   * @param options - Additional options.
   */
  stopAnimation(options?: Token.StopAnimationOptions): void;

  /**
   * Get the texture transition type.
   * Returns `"fade"` by default.
   * @param options - The options that configure the animation behavior
   * @returns The transition type
   */
  protected _getAnimationTransition(options: Token.AnimateOptions): Token.AnimationTransition;

  /**
   * Prepare the animation data changes: performs special handling required for animating rotation.
   * @param from    - The animation data to animate from
   * @param changes - The animation data changes
   * @param context - The animation context
   * @param options - The options that configure the animation behavior
   * @returns The animation attributes
   */
  protected _prepareAnimation(
    from: Token.AnimationDataForRotation,
    changes: Token.PartialAnimationData,
    context: Token.AnimationContext,
    options?: Token.PrepareAnimationOptions,
  ): CanvasAnimation.Attribute[];

  /**
   * Get the drop position for the given token.
   * @see {@linkcode foundry.canvas.layers.TokenLayer._onDropActorData | TokenLayer#_onDropActorData}
   * @internal
   */
  static _getDropActorPosition(
    token: TokenDocument.Implementation,
    point: Canvas.ElevatedPoint,
    options?: Token.GetDropActorPositionOptions,
  ): TokenDocument.Position;

  /**
   * Check for collision when attempting a move to a new position.
   *
   * The result of this function must not be affected by the animation of this Token.
   * @param destination - The central destination point of the attempted movement.
   * The elevation defaults to the elevation of the origin.
   * @param options     - Additional options forwarded to
   * {@linkcode foundry.canvas.geometry.PointSourcePolygon.testCollision | PointSourcePolygon.testCollision}
   * @returns The collision result depends on the mode of the test:
   * - any: returns a boolean for whether any collision occurred
   * - all: returns a sorted array of PolygonVertex instances
   * - closest: returns a PolygonVertex instance or null
   */
  checkCollision<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>(
    destination: Canvas.Point | Canvas.ElevatedPoint,
    options?: Token.CheckCollisionOptions<Mode>,
  ): PointSourcePolygon.TestCollision<Coalesce<Mode, "any">>;

  /**
   * Get the shape of this Token.
   */
  getShape(): PIXI.Rectangle | PIXI.Polygon | PIXI.Circle | PIXI.Ellipse;

  /**
   * Get the center point of the Token.
   * @param position - The position in pixels
   * @returns The center point
   */
  getCenterPoint(position?: Canvas.Point | null): Canvas.Point;

  override getSnappedPosition(position?: Canvas.Point | null): Canvas.Point;

  override _pasteObject(offset: Canvas.Point, options?: PlaceableObject.PasteObjectOptions): Token.PasteObjectData;

  /**
   * Measure the movement path for this Token.
   * @param waypoints - The waypoints of movement
   * @param options   - Additional options that affect cost calculations
   * (passed to {@linkcode Token._getMovementCostFunction | Token#_getMovementCostFunction})
   */
  measureMovementPath(
    waypoints: Token.MeasureMovementPathWaypoint[],
    options?: Token.MeasureMovementPathOptions,
  ): foundry.grid.BaseGrid.MeasurePathResult;

  /**
   * Create the movement cost function for this Token.
   * In square and hexagonal grids it calculates the cost for single grid space move between two grid space offsets.
   * For tokens that occupy more than one grid space the cost of movement is calculated as the median of all individual
   * grid space moves unless the cost of any of these is infinite, in which case total cost is always infinite.
   * In gridless grids the `from` and `to` parameters of the cost function are top-left offsets.
   * If the movement cost function is undefined, the cost equals the distance moved.
   * @param options - Additional options that affect cost calculations
   */
  protected _getMovementCostFunction(
    options?: Token.MeasureMovementPathOptions,
  ): TokenDocument.MovementCostFunction | void;

  /**
   * Constrain the given movement path.
   *
   * The result of this function must not be affected by the animation of this Token.
   * @param waypoints - The waypoints of movement
   * @param options   - Additional options (default: `{}`)
   * @returns The (constrained) path of movement and a boolean that is true if and only if the path was constrained.
   * If it wasn't constrained, then a copy of the path of all given waypoints with all default values filled in
   * is returned.
   */
  constrainMovementPath(
    waypoints: Token.ConstrainMovementPathWaypoint[],
    options?: Token.ConstrainMovementPathOptions,
  ): Token.ConstrainMovementPathReturn;

  /**
   * Get movement wall collision configuration that are passed to
   * {@linkcode foundry.canvas.geometry.PointSourcePolygon.testCollision | PointSourcePolygon#testCollision}
   * as part of {@linkcode Token.constrainMovementPath | Token#constrainMovementPath}.
   * @param segment - The movement segment
   * @param options - The constrain options. The `preview` option is always defined
   * and true for GMs and when Token Vision is disabled.
   */
  protected _getMovementCollisionTestConfiguration(
    segment: TokenDocument.MovementSegmentData,
    options: Token.ConstrainMovementPathOptions,
  ): PointSourcePolygon.Config;

  /**
   * Find a movement path through the waypoints.
   * The path may not necessarily be one with the least cost.
   * The path returned may be partial, i.e. it doesn't go through all waypoints, but must always start with the first
   * waypoints unless the waypoints are empty, in which case an empty path is returned.
   *
   * The result of this function must not be affected by the animation of this Token.
   * @param waypoints - The waypoints of movement
   * @param options   - Additional options
   * @returns The job of the movement pathfinder
   */
  findMovementPath(
    waypoints: Token.FindMovementPathWaypoint[],
    options?: Token.FindMovementPathOptions,
  ): Token.FindMovementPathJob;

  /**
   * This function adds intermediate waypoints pre/post enter and exit for a {@link Region} if the Region
   * has at least one Behavior that could affect the movement, which is determined by
   * `foundry.data.regionBehaviors.RegionBehaviorType#_getTerrainEffects`.
   * For each segment of the movement path the terrain data is created from all behaviors that
   * could affect the movement of this Token with `CONFIG.Token.movement.TerrainData.resolveTerrainEffects`.
   * This terrain data is included in the returned regionalized movement path.
   * This terrain data may then be used in {@link Token._getMovementCostFunction | `Token#_getMovementCostFunction`}
   * and {@link Token.constrainMovementPath | `Token#constrainMovementPath`}.
   * @param waypoints - The waypoints of movement
   * @param options   - Additional options (default: `{}`)
   * @returns The movement path with terrain data
   */
  createTerrainMovementPath(
    waypoints: Token.GetTerrainMovementPathWaypoint[],
    options?: Token.CreateTerrainMovementPathOptions,
  ): Token.TerrainMovementWaypoint[];

  /**
   * Set this Token as an active target for the current game User.
   * @param targeted - Is the Token now targeted? (default: `true`)
   * @param options  - Additional option which modify how targets are acquired (default: `{}`)
   */
  setTarget(targeted?: boolean, options?: Token.TargetContext): void;

  /**
   * Handle updating the targeting state of this Token for a particular User.
   * @param targeted - Is the Token now targeted?
   * @param user     - The user whose targeting state has changed
   * @internal
   */
  protected _updateTarget(targeted: boolean, user: User.Implementation): void;

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

  override _getShiftedPosition(dx: -1 | 0 | 1, dy: -1 | 0 | 1, dz: -1 | 0 | 1): Canvas.ElevatedPoint;

  /**
   * Get the movement action in {@linkcode CONFIG.Token.movement | CONFIG.Token.movement.actions} to be used for keyboard
   * movement.
   * The default implementation returns `this.document.movementAction`.
   */
  protected _getKeyboardMovementAction(): string;

  /**
   * Get the position for movement via the Token HUD.
   * @see {@linkcode foundry.applications.hud.TokenHUD._onSubmit | TokenHUD#_onSubmit}
   * @internal
   */
  _getHUDMovementPosition(elevation: number): InexactPartial<TokenDocument.Position>;

  /**
   * Get the movement action in {@linkcode CONFIG.Token.movement | CONFIG.Token.movement.actions} to be used for movement
   * via the Token HUD.
   * The default implementation returns `this.document.movementAction`.
   * @see {@linkcode foundry.applications.hud.TokenHUD._onSubmit | TokenHUD#_onSubmit}
   */
  protected _getHUDMovementAction(): string;

  /**
   * Get the position for movement via the Token Config.
   * @see {@linkcode foundry.applications.sheets.TokenConfig._processSubmitData | TokenConfig#_processSubmitData}
   * @internal
   */
  _getConfigMovementPosition(changes: InexactPartial<TokenDocument.Position>): InexactPartial<TokenDocument.Position>;

  override _updateRotation(options?: PlaceableObject.UpdateRotationOptionsWithAngle): number;
  override _updateRotation(options?: PlaceableObject.UpdateRotationOptionsWithDelta): number;

  protected override _onCreate(
    data: TokenDocument.CreateData,
    options: TokenDocument.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected override _onUpdate(
    changed: TokenDocument.UpdateData,
    options: TokenDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected override _onDelete(options: TokenDocument.Database.OnDeleteOptions, userId: string): void;

  /**
   * Automatically pan the canvas to this Token.
   * @param options - Additional options (default: `{}`)
   * @returns Resolves once the panning/transition animation is complete.
   */
  panCanvas(options?: PlaceableObject.TokenPanningOptions): Promise<void>;

  /**
   * Handle changes to Token behavior when a significant status effect is applied
   * @param statusId - The status effect ID being applied, from `CONFIG.specialStatusEffects`
   * @param active   - Is the special status effect now active?
   */
  protected _onApplyStatusEffect(statusId: string, active: boolean): void;

  /**
   * Add/Modify a filter effect on this token.
   * @param statusId - The status effect ID being applied, from `CONFIG.specialStatusEffects`
   * @param active   - Is the special status effect now active?
   * @internal
   */
  protected _configureFilterEffect(statusId: string, active: boolean): void;

  /**
   * Update the filter effects depending on special status effects
   * TODO: replace this method by something more convenient.
   * @internal
   * @privateRemarks The TODO is theirs.
   */
  protected _updateSpecialStatusFilterEffects(): void;

  /**
   * Remove all filter effects on this placeable.
   * @internal
   */
  protected _removeAllFilterEffects(): void;

  // fake type override
  override control(options?: Token.ControlOptions): boolean;

  protected override _onControl(options: Token.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<Token.ReleaseOptions>): void;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _canControl(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): true;

  protected override _canHover(user: User.Implementation, event?: Canvas.Event.Pointer): true;

  protected override _canView(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canDrag(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onHoverIn(event: Canvas.Event.Pointer | Event, options?: PlaceableObject.HoverInOptions): void;

  protected override _onHoverOut(event?: Canvas.Event.Pointer | Event, options?: PlaceableObject.HoverOutOptions): void;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _propagateLeftClick(event: Canvas.Event.Pointer): boolean;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _onClickRight2(event: Canvas.Event.Pointer): void;

  protected override _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Get the terrain options used during the drag operation.
   * @returns The terrain options
   */
  protected _getDragTerrainOptions(): Token.DragTerrainOptions;

  /**
   * Get the constrain options used during the drag operation.
   * @returns The constrain options
   */
  protected _getDragConstrainOptions(): Token.DragConstrainOptions;

  /**
   * Get the measure options used during the drag operation.
   * @returns The measure options
   */
  protected _getDragMeasureOptions(): Token.DragMeasureOptions;

  /**
   * Get the pathfinding options used during the drag operation to find the path of movement through the waypoints.
   * @returns The pathfinding options
   */
  protected _getDragPathfindingOptions(): Token.DragPathfindingOptions;

  /**
   * Get the movement action for the waypoints placed during a drag operation.
   * @returns The movement action
   */
  protected _getDragMovementAction(): string;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  /**
   * Prevent the drop event?
   * Called by {@linkcode Token._onDragLeftDrop | Token#_onDragLeftDrop}.
   * @param event - The pointerup event
   */
  protected _shouldPreventDragLeftDrop(event: Canvas.Event.Pointer): boolean;

  /**
   * Get the update operation options that should be used for a drag-left-drop operation.
   */
  protected _getDragLeftDropUpdateOptions(): Token.DragLeftDropUpdateOptions;

  protected override _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): Token.DragLeftDropUpdate[];

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the destinations of the drag previews and rulers
   * @param point   - The (unsnapped) center point of the waypoint
   * @param options - Additional options (default: `{}`)
   */
  protected _updateDragDestination(point: Canvas.Point, options?: Token.DragWaypointPositionOptions): void;

  /**
   * Get the origin of the drag operation.
   * @internal
   */
  _getDragOrigin(): Canvas.Point;

  /**
   * Called by {@linkcode foundry.canvas.layers.TokenLayer._onClickLeft | TokenLayer#_onClickLeft} while this Token is in a drag workflow.
   * @param event - The pointerdown event
   */
  protected _onDragClickLeft(event: Canvas.Event.Pointer): void;

  /**
   * Add ruler waypoints and update ruler paths.
   * @param point   - The (unsnapped) center point of the waypoint
   * @param options - Additional options (default: `{}`)
   */
  protected _addDragWaypoint(point: Canvas.Point, options?: Token.DragWaypointPositionOptions): void;

  /**
   * Trigger drop event. This drop cannot be prevented by {@linkcode Token._shouldPreventDragLeftDrop | Token#_shouldPreventDragLeftDrop}.
   */
  protected _triggerDragLeftDrop(): void;

  /**
   * Called by {@linkcode foundry.canvas.layers.TokenLayer._onClickLeft2 | TokenLayer#_onClickLeft2} while this Token is in a drag workflow.
   * @param event - The pointerdown event
   */
  protected _onDragClickLeft2(event: Canvas.Event.Pointer): void;

  /**
   * Called by {@linkcode foundry.canvas.layers.TokenLayer._onClickRight | TokenLayer#_onClickRight} while this Token is in a drag workflow.
   * @param event - The pointerdown event
   */
  protected _onDragClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Remove last ruler waypoints and update ruler paths.
   */
  protected _removeDragWaypoint(): void;

  /**
   * Cancel the drag workflow. This cancellation cannot be prevented by {@linkcode Token._onDragLeftCancel | Token#_onDragLeftCancel}.
   */
  protected _triggerDragLeftCancel(): void;

  /**
   * Called by {@linkcode foundry.canvas.layers.TokenLayer._onClickRight2 | TokenLayer#_onClickRight2} while this Token is in a drag workflow.
   * @param event - The pointerdown event
   */
  protected _onDragClickRight2(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): boolean;

  protected override _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  protected override _onDragEnd(): void;

  /**
   * Change the elevation of Token during dragging.
   * @param event - The mousewheel event
   */
  protected _onDragMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Change the elevation of the dragged Tokens.
   * @param delta   - The number vertical steps
   * @param options - Additional options (default: `{}`)
   */
  protected _changeDragElevation(delta: number, options?: Token.ChangeDragElevationOptions): void;

  /**
   * Get the drag waypoint position.
   */
  protected _getDragWaypointPosition(
    current: Pick<TokenDocument.Position, "x" | "y" | "elevation">,
    changes: InexactPartial<Canvas.ElevatedPoint>,
    options?: Token.DragWaypointPositionOptions,
  ): Token.DragWaypointPosition;

  /**
   * Recalculate the planned movement path of this Token for the current User.
   */
  recalculatePlannedMovementPath(): void;

  /** @deprecated "Token#testInsideRegion is deprecated in favor of TokenDocument#testInsideRegion." (since v13, until v15) */
  testInsideRegion(region: Region.Implementation, position?: Token.TestablePosition | null): boolean;

  /** @deprecated "Token#segmentizeRegionMovement is deprecated in favor of TokenDocument#segmentizeRegionMovementPath." (since v13, until v15) */
  segmentizeRegionMovement(
    region: Region.Implementation,
    waypoints: RegionDocument.SegmentizeMovementPathWaypoint[],
    options?: Region.SegmentizeMovementOptions,
  ): RegionDocument.MovementSegment[];

  /** @deprecated "Token#getSize is deprecated in favor of TokenDocument#getSize." (since v13, until v15) */
  getSize(): Token.Size;

  /**
   * @deprecated "Token#target is deprecated and has been split into two new graphics object: targetArrows and
   * targetPips. targetArrows is returned by the deprecated target property." (since v13, until v15)
   */
  get target(): PIXI.Graphics | undefined;

  /**
   * @deprecated "Token#getMovementAdjustedPoint is deprecated with no replacement. Movement-based adjustment of
   * center points is no longer required. Use the unadjusted point instead, rounding the x and y coordinates as
   * needed." (since v14, until v16)
   */
  getMovementAdjustedPoint(point: Canvas.Point, offsets?: Token.GetMovementAdjustedPointOffsets): Canvas.Point;

  #Token: true;

  static #TokenStatic: true;
}

declare namespace Token {
  /**
   * The implementation of the `Token` placeable configured through `CONFIG.Token.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode TokenDocument.Implementation}
   * which refers to the implementation for the Token document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `Token` placeable configured through `CONFIG.Token.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode TokenDocument.ImplementationClass}
   * which refers to the implementation for the Token document.
   */
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"Token">;

  type Schema = TokenDocument.Schema;
  type Parent = TokenDocument.Parent;

  type Metadata = TokenDocument.Metadata;

  export import UpdateData = TokenDocument.UpdateData;
  export import Source = TokenDocument.Source;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    redrawEffects: RenderFlag<this, "redrawEffects">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshNameplate", "refreshElevation", "refreshRingVisuals", "refreshRuler", "refreshTurnMarker"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility", "refreshTarget"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshRotation", "refreshSize"], alias: true }` */
    refreshTransform: RenderFlag<this, "refreshTransform">;

    /** @defaultValue `{}` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{}` */
    refreshRotation: RenderFlag<this, "refreshRotation">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshShape", "refreshBars", "refreshEffects", "refreshNameplate", "refreshTarget", "refreshTooltip"] }` */
    refreshSize: RenderFlag<this, "refreshSize">;

    /** @defaultValue `{ propagate: ["refreshTooltip"] }` */
    refreshElevation: RenderFlag<this, "refreshElevation">;

    /** @defaultValue `{ propagate: ["refreshShader"] }` */
    refreshMesh: RenderFlag<this, "refreshMesh">;

    /** @defaultValue `{}` */
    refreshShader: RenderFlag<this, "refreshShader">;

    /** @defaultValue `{ propagate: ["refreshVisibility", "refreshPosition", "refreshBorder", "refreshEffects"] }` */
    refreshShape: RenderFlag<this, "refreshShape">;

    /** @defaultValue `{}` */
    refreshBorder: RenderFlag<this, "refreshBorder">;

    /** @defaultValue `{}` */
    refreshBars: RenderFlag<this, "refreshBars">;

    /** @defaultValue `{}` */
    refreshEffects: RenderFlag<this, "refreshEffects">;

    /** @defaultValue `{}` */
    refreshNameplate: RenderFlag<this, "refreshNameplate">;

    /** @defaultValue `{}` */
    refreshTarget: RenderFlag<this, "refreshTarget">;

    /** @defaultValue `{}` */
    refreshTooltip: RenderFlag<this, "refreshTooltip">;

    /** @defaultValue `{}` */
    refreshRingVisuals: RenderFlag<this, "refreshRingVisuals">;

    /** @defaultValue `{}` */
    refreshRuler: RenderFlag<this, "refreshRuler">;

    /** @defaultValue `{}` */
    refreshTurnMarker: RenderFlag<this, "refreshTurnMarker">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface PasteObjectData {
    x: number;
    y: number;
    elevation: number;
    level: string;
    hidden: boolean;
  }

  interface Bars extends PIXI.Container {
    bar1: PIXI.Graphics;
    bar2: PIXI.Graphics;
  }

  interface BarColors {
    empty: Color;
    full: Color;
  }

  type MeasuredMovementWaypoint = TokenDocument.MeasuredMovementWaypoint;

  interface MeasureMovementPathWaypoint extends InexactPartial<
    Pick<
      TokenDocument.MeasuredMovementWaypoint,
      "x" | "y" | "elevation" | "width" | "height" | "depth" | "shape" | "level" | "action" | "terrain"
    >
  > {
    /**
     * A predetermined cost (nonnegative) or cost function to be used instead of `options.cost`.
     */
    cost?: number | TokenDocument.MovementCostFunction | undefined;
  }

  interface PlannedMovement {
    foundPath: Omit<TokenDocument.MeasuredMovementWaypoint, "userId" | "movementId">[];
    unreachableWaypoints: Omit<TokenDocument.MeasuredMovementWaypoint, "userId" | "movementId">[];
    history: TokenDocument.MeasuredMovementWaypoint[];
    hidden: boolean;
    searching: boolean;
  }

  interface DragContext {
    token: Token.Implementation;
    clonedToken: Token.Implementation;
    origin: TokenDocument.Position;
    destination: TokenDocument.MovementWaypoint;
    waypoints: Partial<TokenDocument.MovementWaypoint>[];
    foundPath: TokenDocument.MovementWaypoint[];
    unreachableWaypoints: TokenDocument.MovementWaypoint[];
    hidden: boolean;
    updating: boolean;
    search: Token.FindMovementPathJob;
    searching: boolean;
    searchId: number;
  }

  type PlanMovementTerrainOptions = Omit<Token.CreateTerrainMovementPathOptions, "preview">;
  type PlanMovementConstrainOptions = Omit<
    Token.ConstrainMovementPathOptions,
    "preview" | "history" | "measureOptions"
  >;
  type PlanMovementMeasureOptions = Omit<Token.MeasureMovementPathOptions, "preview">;
  type PlanMovementPathfindingOptions = Omit<
    Token.FindMovementPathOptions,
    "preview" | "terrainOptions" | "constrainOptions" | "measureOptions"
  >;
  interface PlanMovementMoveOptions {
    autoRotate?: boolean | undefined;
    showRuler?: boolean | undefined;
    split?: boolean | undefined;
    pan?: boolean | PlaceableObject.TokenPanningOptions | undefined;
    animate?: boolean | undefined;
    animation?: Pick<Token.AnimateOptions, "duration" | "movementSpeed" | "linkToMovement" | "easing"> | undefined;
  }

  interface PlanMovementOptions {
    allowedActions?: Iterable<string> | null | undefined;
    direct?: boolean | undefined;
    minCost?: number | undefined;
    maxCost?: number | undefined;
    minDistance?: number | undefined;
    maxDistance?: number | undefined;
    preventDrop?: boolean | undefined;
    terrainOptions?: PlanMovementTerrainOptions | undefined;
    constrainOptions?: PlanMovementConstrainOptions | undefined;
    measureOptions?: PlanMovementMeasureOptions | undefined;
    pathfindingOptions?: PlanMovementPathfindingOptions | undefined;
    moveOptions?: PlanMovementMoveOptions | undefined;
  }

  interface PlanMovementResult {
    id: string;
    origin: TokenDocument.Position;
    destination: TokenDocument.Position;
    waypoints: TokenDocument.MovementWaypoint[];
  }

  /** @internal */
  interface _GetMovementAdjustedPointOffsets {
    /** @defaultValue `0` */
    offsetX: number;

    /** @defaultValue `0` */
    offsetY: number;
  }

  interface GetMovementAdjustedPointOffsets extends InexactPartial<_GetMovementAdjustedPointOffsets> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  /** @internal */
  interface _ControlOptions {
    /** @defaultValue `false` */
    pan: boolean | PlaceableObject.TokenPanningOptions;
  }

  interface ControlOptions extends InexactPartial<_ControlOptions>, PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /**
   * @remarks {@linkcode Token._getLightSourceData | Token#_getLightSourceData} calls `mergeObject` on the return of
   * {@linkcode LightData.toObject | LightData#toObject(false)} and the enumerated properties below and returns the result. This gets passed
   * to {@linkcode sources.PointLightSource.initialize | Token#light#initialize()}, so this is a `RequiredProps<IntentionalPartial<>>`
   * rather than a `Pick<>`.
   */
  type LightSourceData = foundry.data.fields.SchemaField.InitializedData<LightData.Schema> &
    RequiredProps<
      IntentionalPartial<sources.PointLightSource.SourceData>,
      "x" | "y" | "elevation" | "rotation" | "dim" | "bright" | "externalRadius" | "seed" | "preview" | "disabled"
    >;

  /**
   * @remarks The return of {@linkcode Token._getVisionSourceData | Token#_getVisionSourceData}, which gets passed to
   * {@linkcode sources.PointVisionSource.initialize | Token#vision#initialize()}, so this is a `RequiredProps<IntentionalPartial<>>`
   * rather than a `Pick<>`.
   */
  type VisionSourceData = RequiredProps<
    IntentionalPartial<foundry.canvas.sources.PointVisionSource.SourceData>,
    | "x"
    | "y"
    | "elevation"
    | "rotation"
    | "lightRadius"
    | "externalRadius"
    | "angle"
    | "contrast"
    | "saturation"
    | "brightness"
    | "attenuation"
    | "visionMode"
    | "color"
    | "preview"
    | "disabled"
  >;

  // TODO(LukeAbby) possible candidate for `-=` key handling
  interface BlindedStates extends Record<string, boolean> {
    blind: boolean;
    burrow: boolean;
  }

  /** @internal */
  interface _ReticuleOptions {
    /**
     * The amount of margin between the targeting arrows and the token's bounding box, expressed as a fraction of an arrow's size.
     * @defaultValue `0`
     * @remarks This gets assigned to with `*=` before use, so `null` casting to the default of `0` is fine
     */
    margin: number;

    /**
     * The color of the arrows.
     * @defaultValue {@linkcode Token.Implementation._getBorderColor | this._getBorderColor()}
     */
    color: number;

    /**
     * The alpha value of the arrows.
     * @defaultValue `1`
     */
    alpha: number;

    /**
     * The size of the arrows as a proportion of grid size.
     * @defaultValue {@linkcode CONFIG.Canvas.targeting | CONFIG.Canvas.targeting.size}
     */
    size: number;

    /**
     * The arrows' border style configuration.
     * @defaultValue see properties
     */
    border: InexactPartial<{
      /**
       * The border color.
       * @defaultValue `0`
       */
      color: number;

      /**
       * The border width.
       * @defaultValue `2`
       */
      width: number;
    }>;
  }

  interface ReticuleOptions extends InexactPartial<_ReticuleOptions> {}

  /**
   * The return type of {@linkcode Token.getRingColors | Token#getRingColors}. Core's implementation returns `{}`.
   * Values returned by subclasses should not be nullish, as they are `mergeObject`'d into the default color values
   * from {@linkcode TokenRing.ImplementationClass}
   */
  interface RingColors {
    ring?: Color | undefined;
    background?: Color | undefined;
  }

  /** @internal */
  type _AnimationData = Pick<
    TokenDocument.Implementation,
    "x" | "y" | "elevation" | "width" | "height" | "depth" | "rotation" | "alpha" | "bar1" | "bar2"
  > & {
    /** The level ID. */
    level: string;

    /** The texture data. */
    texture: Pick<
      TokenDocument.Implementation["texture"],
      "src" | "anchorX" | "anchorY" | "scaleX" | "scaleY" | "tint"
    >;

    /** The ring data. */
    ring: {
      /** The ring subject data */
      subject: Pick<TokenDocument.Implementation["ring"]["subject"], "texture" | "scale">;
    };
  };

  /**
   * Token animation data.
   * @privateRemarks Implementing this interface like this does lose the specific (simplified, really)
   * property descriptions of the `TokenAnimationData` typedef, but it gains the ones from the document
   * schema, and since the values returned by {@linkcode Token._getAnimationData | Token#_getAnimationData}
   * are pulled directly from the document, this is also the most accurate typing.
   */
  interface AnimationData extends _AnimationData {}

  type PartialAnimationData = DeepPartial<AnimationData>;

  interface AnimationDataForDuration extends RequiredProps<PartialAnimationData, "x" | "y" | "rotation"> {}

  interface AnimationDataForRotation extends RequiredProps<PartialAnimationData, "rotation"> {}

  /** @internal */
  interface _GetAnimationDurationOptions {
    /**
     * A desired token movement speed in grid spaces per second
     * @defaultValue `6`
     */
    movementSpeed: number;
  }

  interface GetAnimationDurationOptions extends InexactPartial<_GetAnimationDurationOptions> {}

  /** @internal */
  interface _PrepareAnimationOptions {
    /**
     * The desired texture transition type
     * @defaultValue `TextureTransitionFilter.TYPES.FADE` (`"fade"`)
     */
    transition: TextureTransitionFilter.TYPES;
  }

  interface PrepareAnimationOptions extends InexactPartial<_PrepareAnimationOptions> {}

  type AnimationTransition = TextureTransitionFilter.TYPES;

  /** @internal */
  interface _AnimateOptions extends Pick<CanvasAnimation.AnimateOptions, "duration" | "easing" | "ontick"> {
    /**
     * The name of the animation, or `null` if nameless.
     */
    name: string | symbol | null;

    /**
     * Chain the animation to the existing one of the same name?
     * @defaultValue `false`
     */
    chain: boolean;

    /**
     * The movement action.
     */
    action: string;

    /**
     * The terrain data.
     * @defaultValue `null`
     */
    terrain: foundry.abstract.DataModel.Any | null;

    /** A desired base movement speed in grid spaces per second. */
    movementSpeed: number;

    /** The movement speed multiplier to apply to the base movement speed. */
    speedMultiplier: number;
  }

  interface AnimateOptions
    extends InexactPartial<_AnimateOptions>, GetAnimationDurationOptions, PrepareAnimationOptions {
    /**
     * @remarks If `true`, the `duration` of the animation will be overridden by the calculated total movement animation duration in
     * `Token##onUpdateAnimation` (via {@linkcode Token._onUpdate | Token#_onUpdate}).
     */
    linkToMovement?: boolean | undefined;
  }

  /** @internal */
  interface _StopAnimationOptions {
    /**
     * Reset the TokenDocument?
     * @defaultValue `false`
     */
    reset: boolean;
  }

  interface StopAnimationOptions extends InexactPartial<_StopAnimationOptions> {}

  /** @internal */
  interface _CheckCollisionOptions<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined> {
    /**
     * The collision mode to test: "any", "all", or "closest"
     * @defaultValue `"any"`
     */
    mode: Mode;

    /**
     * The collision type
     * @defaultValue `"move"`
     * @remarks `"sound"` is a valid source type but explicitly throws if passed, so omitted here
     */
    type: "move" | "sight" | "light";

    /**
     * The origin to be used instead of the current origin
     */
    origin: Canvas.Point | Canvas.ElevatedPoint;
  }

  interface CheckCollisionOptions<
    Mode extends PointSourcePolygon.CollisionModes | undefined = undefined,
  > extends InexactPartial<_CheckCollisionOptions<Mode>> {}

  /** Return type of {@linkcode Token.getSize | Token#getSize} */
  interface Size {
    width: number;
    height: number;
  }

  /**
   * @privateRemarks Foundry types this as `Point | (Point & {elevation: number}) | {elevation: number}`,
   * but this is misleading, as if an object is passed for the 2nd param of {@linkcode Token.testInsideRegion | Token#testInsideRegion}
   * then it must contain `{x, y}` data, only if the value is nullish does the document's data get used.
   * Passing just `{elevation: number}` would result in `{x: undefined, y: undefined}`, causing
   * `PIXI.Rectangle#contains()` to always return false.
   *
   * Not reported, as `testInsideRegion` is deprecated and thus untyped in v13.
   */
  type TestablePosition = Canvas.Point & { elevation?: number | undefined };

  interface _InitializeSourcesOptions {
    /**
     * Indicate that this source has been deleted.
     * @defaultValue `false`
     */
    deleted: boolean;
  }

  interface InitializeSourcesOptions extends InexactPartial<_InitializeSourcesOptions> {}

  interface GetDropActorPositionOptions {
    /**
     * Snap the position to the grid?
     * @defaultValue `false`
     */
    snap?: boolean | undefined;
  }

  /** @internal */
  interface _TargetContext {
    /**
     * Release other active targets for the same player?
     * @defaultValue `true`
     * @remarks Only an omitted or `undefined` value uses the default.
     */
    releaseOthers: boolean;
  }

  interface TargetContext extends InexactPartial<_TargetContext> {}

  interface AnimationChainLink {
    to: PartialAnimationData;
    options: Omit<Token.AnimateOptions, "duration"> & { duration: number };
    promise: Promise<void>;
    resolve: () => void;
    reject: (error: Error) => void;
  }

  interface AnimationContext {
    /** The name of the animation */
    name: string | symbol;

    /** The animation chain. */
    chain: Token.AnimationChainLink[];

    /**
     * The final animation state
     * @remarks This gets `mergeObject`ed with the return of {@linkcode Token._getAnimationData | Token#_getAnimationData}.
     */
    to: PartialAnimationData;

    /** The duration of the animation */
    duration: number;

    /** The current time of the animation */
    time: number;

    /** Asynchronous functions that are executed before the animation starts */
    preAnimate: ((context: Token.AnimationContext) => Promise<void>)[];

    /** Synchronous functions that are executed after the animation ended */
    postAnimate: ((context: Token.AnimationContext) => void)[];

    /**
     * Synchronous functions that are executed each frame after `ontick` and before
     * {@linkcode Token._onAnimationUpdate | Token#_onAnimationUpdate}
     */
    onAnimate: ((context: Token.AnimationContext) => void)[];

    /** The promise of the animation, which resolves once it completes or is terminated. */
    promise: Promise<void>;
  }

  interface DragLeftDropUpdate {
    _id: string;
  }

  interface DragLeftDropMovement {
    waypoints: TokenDocument.MovementWaypoint[];
    method: "dragging";
    constrainOptions: Token.DragConstrainOptions;
  }

  interface DragLeftDropOperation extends DragLeftDropUpdateOptions {
    method: "dragging";
    movement: Record<string, Token.DragLeftDropMovement>;
  }

  /**
   * @remarks This is the runtime return shape of {@link Token._prepareDragLeftDropUpdates | `Token#_prepareDragLeftDropUpdates`}.
   * The method itself is typed more narrowly because of higher-order unsoundness in {@link PlaceableObject}.
   */
  type DragLeftDropReturn = [updates: Token.DragLeftDropUpdate[], operation: Token.DragLeftDropOperation];

  interface MeasureMovementPathOptions {
    /**
     * Measure a preview path?
     * @defaultValue `false`
     */
    preview?: boolean | undefined;
  }

  interface ConstrainMovementPathWaypoint extends InexactPartial<
    Pick<
      TokenDocument.MeasuredMovementWaypoint,
      | "x"
      | "y"
      | "elevation"
      | "width"
      | "height"
      | "depth"
      | "shape"
      | "level"
      | "action"
      | "terrain"
      | "snapped"
      | "explicit"
      | "checkpoint"
      | "intermediate"
    >
  > {}

  interface ConstrainMovementPathOptions extends InexactPartial<{
    /**
     * Constrain a preview path?
     * @defaultValue `false`
     */
    preview: boolean;

    /**
     * Ignore walls?
     * @defaultValue `false`
     */
    ignoreWalls: boolean;

    /**
     * Ignore cost?
     * @defaultValue `false`
     */
    ignoreCost: boolean;

    /** The maximum cumulative cost. */
    maxCost: number;

    /** The maximum cumulative distance. */
    maxDistance: number;

    /**
     * Consider movement history? If true, uses the current movement history. If waypoints are passed, uses those as the history.
     * @defaultValue `false`
     * @remarks marked by foundry as readonly
     */
    history: boolean | TokenDocument.MeasuredMovementWaypoint[];

    /** The measurement options. */
    measureOptions: Omit<Token.MeasureMovementPathOptions, "preview">;
  }> {}

  type ConstrainedMovementWaypoint = TokenDocument.CompleteMovementWaypoint;

  type ConstrainMovementPathReturn = [constrainedPath: Token.ConstrainedMovementWaypoint[], wasConstrained: boolean];

  interface FindMovementPathWaypoint {
    /**
     * The top-left x-coordinate in pixels (integer).
     * @defaultValue the previous or source x-coordinate.
     */
    x?: number | undefined;

    /**
     * The top-left y-coordinate in pixels (integer).
     * @defaultValue the previous or source y-coordinate.
     */
    y?: number | undefined;

    /**
     * The elevation in grid units.
     * @defaultValue the previous or source elevation.
     */
    elevation?: number | undefined;

    /**
     * The width in grid spaces (positive).
     * @defaultValue the previous or source width.
     */
    width?: number | undefined;

    /**
     * The height in grid spaces (positive).
     * @defaultValue the previous or source height.
     */
    height?: number | undefined;

    /**
     * The shape type (see {@linkcode CONST.TOKEN_SHAPES}).
     * @defaultValue the previous or source shape.
     */
    shape?: CONST.TOKEN_SHAPES | undefined;

    /**
     * The movement action from the previous to this waypoint.
     */
    action?: string | undefined;

    /**
     * Was this waypoint snapped to the grid?
     * @defaultValue `false`.
     */
    snapped?: boolean | undefined;

    /**
     * Was this waypoint explicitly placed by the user?
     * @defaultValue `false`.
     */
    explicit?: boolean | undefined;

    /**
     * Is this waypoint a checkpoint?
     * @defaultValue `false`.
     */
    checkpoint?: boolean | undefined;
  }

  interface FindMovementPathOptions {
    /**
     * Find a preview path?
     * @defaultValue `false`
     */
    preview?: boolean | undefined;

    /**
     * Unless the path can be found instantly, delay the start of the pathfinding
     * computation by this number of milliseconds.
     * @defaultValue `0`
     */
    delay?: number | undefined;

    /** The terrain options. */
    terrainOptions?: Omit<Token.CreateTerrainMovementPathOptions, "preview"> | undefined;

    /** The constrain options. */
    constrainOptions?: Omit<Token.ConstrainMovementPathOptions, "preview" | "measureOptions"> | undefined;

    /** The measure options. */
    measureOptions?: Omit<Token.MeasureMovementPathOptions, "preview"> | undefined;
  }

  interface FindMovementPathJob {
    /**
     * The result of the pathfinding job. Undefined while the
     * search is in progress, null if the job was cancelled,
     * and the (partial) path if the job completed.
     */
    result: TokenDocument.MovementWaypoint[] | null | undefined;

    /**
     * The promise returning the (partial) path that as found
     * or null if cancelled.
     */
    promise: Promise<TokenDocument.MovementWaypoint[] | null>;

    /**
     * If this function is called and the job hasn't completed
     * yet, the job is cancelled.
     */
    cancel: () => void;
  }

  /** A waypoint used as input to {@link Token.createTerrainMovementPath | `Token#createTerrainMovementPath`}. */
  type GetTerrainMovementPathWaypoint = Omit<TokenDocument.GetCompleteMovementPathWaypoint, "terrain">;

  /** Options for {@link Token.createTerrainMovementPath | `Token#createTerrainMovementPath`}. */
  interface CreateTerrainMovementPathOptions {
    /**
     * Is this a preview path?
     * @defaultValue `false`
     */
    preview?: boolean | undefined;
  }

  /** A waypoint in the terrain-annotated movement path returned by {@link Token.createTerrainMovementPath | `Token#createTerrainMovementPath`}. */
  type TerrainMovementWaypoint = TokenDocument.CompleteMovementWaypoint;

  type DragTerrainOptions = Omit<Token.CreateTerrainMovementPathOptions, "preview">;

  type DragConstrainOptions = Omit<Token.ConstrainMovementPathOptions, "preview" | "history" | "measureOptions">;

  type DragMeasureOptions = Omit<Token.MeasureMovementPathOptions, "preview">;

  type DragPathfindingOptions = Omit<
    Token.FindMovementPathOptions,
    "preview" | "terrainOptions" | "constrainOptions" | "measureOptions"
  >;

  interface DragLeftDropUpdateOptions {
    terrainOptions: DragTerrainOptions;
    constrainOptions: DragConstrainOptions;
    measureOptions: DragMeasureOptions;
  }

  interface DragWaypointPositionOptions extends InexactPartial<{
    /**
     * Snap the destination?
     * @defaultValue `false`
     */
    snap: boolean;
  }> {}

  interface ChangeDragElevationOptions extends InexactPartial<{
    /**
     * Round elevations to multiples of the grid distance divided by
     * `CONFIG.Canvas.elevationSnappingPrecision`? If false, rounds to multiples of the grid distance.
     * @defaultValue `false`
     */
    precise: boolean;
  }> {}

  type DragWaypointPosition = Pick<TokenDocument.Position, "x" | "y" | "elevation"> & Partial<TokenDocument.Dimensions>;
}

export default Token;
