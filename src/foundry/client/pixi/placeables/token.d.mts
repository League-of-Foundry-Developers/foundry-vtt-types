import type {
  Coalesce,
  DeepPartial,
  FixedInstanceType,
  HandleEmptyObject,
  InexactPartial,
  IntentionalPartial,
  NullishProps,
  RequiredProps,
} from "#utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { PreciseText } from "#client/canvas/containers/_module.mjs";
import type { TextureTransitionFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import BaseToken = foundry.documents.BaseToken;
import sources = foundry.canvas.sources;

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Token: Token.Implementation;
    }
  }
}

declare global {
  /**
   * A Token is an implementation of PlaceableObject which represents an Actor within a viewed Scene on the game canvas.
   * @see {@linkcode TokenDocument}
   * @see {@linkcode TokenLayer}
   */
  class Token extends PlaceableObject<TokenDocument.Implementation> {
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
     * @remarks Only `undefined` prior to {@link Token._refreshShape | `Token#_refreshShape`} being called.     *
     * @privateRemarks Foundry types this as possibly being `PIXI.Circle` but {@link Token.getShape | `Token#getShape`} only returns `Rectangle` or `Polygon` in v12
     */
    shape: PIXI.Rectangle | PIXI.Polygon | undefined;

    /**
     * Defines the filter to use for detection.
     * @defaultValue `null`
     * @remarks Only set to other-than-`null` externally, in {@link CanvasVisibility.testVisibility | `CanvasVisibility#testVisibility`}
     *
     * Set `null` unconditionally when {@link Token.isVisible | `Token#isVisible`} is accessed
     */
    detectionFilter: PIXI.Filter | null;

    /**
     * A Graphics instance which renders the border frame for this Token inside the GridLayer.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    border: PIXI.Graphics | undefined;

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
     * The target marker, which indicates that this Token is targeted by this User or others.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    target: PIXI.Graphics | undefined;

    /**
     * The nameplate of this Token, which displays its name.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    nameplate: PreciseText | undefined;

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
     * @privateRemarks Foundry types as `PIXI.DisplayObject`, but its only ever set to `PIXI.Container` in v12
     */
    voidMesh: PIXI.Container | undefined;

    /**
     * Renders the mesh of with the detection filter.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     * @privateRemarks Foundry types as `PIXI.DisplayObject`, but its only ever set to `PIXI.Container` in v12
     */
    detectionFilterMesh: PIXI.Container | undefined;

    /**
     * The texture of this Token, which is used by its mesh.
     * @defaultValue `undefined`
     * @remarks `undefined` prior to first draw or after {@link Token._destroy | `Token#_destroy`} is called
     */
    texture: PIXI.Texture | undefined;

    /**
     * A reference to the VisionSource object which defines this vision source area of effect
     * @defaultValue `undefined`
     * @remarks `undefined` prior to first draw or after {@link Token._destroy | `Token#_destroy`} is called, or
     * {@link Token.initializeVisionSource | `Token#initializeVisionSource`} is called with `{deleted: true}`
     */
    vision: sources.PointVisionSource.ConfiguredInstance | undefined;

    /**
     * A reference to the LightSource object which defines this light source area of effect
     * @defaultValue `undefined`
     * @remarks `undefined` prior to first draw or after {@link Token._destroy | `Token#_destroy`} is called, or
     * {@link Token.initializeLightSource | `Token#initializeLightSource`} is called with `{deleted: true}`
     *
     * Whether this is a LightSource or a DarknessSource depends on `this.document.light.negative`
     */
    light: sources.PointLightSource.ConfiguredInstance | sources.PointDarknessSource.ConfiguredInstance | undefined;

    /**
     * The current animations of this Token.
     */
    get animationContexts(): Map<string, Token.AnimationContext>;

    /**
     * A TokenRing instance which is used if this Token applies a dynamic ring.
     * This property is null if the Token does not use a dynamic ring.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw. Set `null` if `token.document.ring.enabled` is `false`.
     */
    get ring(): foundry.canvas.tokens.TokenRing.ConfiguredInstance | null | undefined;

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

    /**
     * The Token's current central position
     */
    get center(): PIXI.Point;

    /**
     * The Token's central position, adjusted in each direction by one or zero pixels to offset it relative to walls.
     */
    // offsets: not null (destructured)
    getMovementAdjustedPoint(point: Canvas.Point, offsets?: Token.GetMovementAdjustedPointOffsets): Canvas.Point;

    /**
     * The HTML source element for the primary Tile texture
     * @privateRemarks Foundry types this as `HTMLImageElement | HTMLVideoElement`, but this just
     * returns `this.texture?.baseTexture.resource.source`, which could be any of `PIXI.ImageSource`,
     * and returns `ImageBitmap`, not `HTMLImageElement`, for static images.
     */
    get sourceElement(): PIXI.ImageSource | undefined;

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
    get combatant(): Combatant.Stored;

    /**
     * An indicator for whether the Token is currently targeted by the active game User
     */
    get isTargeted(): boolean;

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
     * @see {@link CanvasVisibility.testVisibility | `CanvasVisibility#testVisibility`}
     */
    get isVisible(): boolean;

    /**
     * The animation name used for Token movement
     * @defaultValue
     * ```js
     * `${this.objectId}.animate`
     * ```
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
     * Does this Ambient Light actively emit darkness given
     * its properties and the current darkness level of the Scene?
     */
    get emitsDarkness(): boolean;

    /**
     * Does this Ambient Light actively emit light given
     * its properties and the current darkness level of the Scene?
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
    // options: not null (destructured)
    initializeSources(options?: Token.InitializeSourcesOptions): void;

    /**
     * Update an emitted light source associated with this Token.
     */
    // options: not null (destructured)
    initializeLightSource(options?: Token.InitializeSourcesOptions): void;

    /**
     * Get the light source data.
     */
    protected _getLightSourceData(): Token.LightSourceData;

    /**
     * Update the VisionSource instance associated with this Token.
     */
    // options: not null (destructured)
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
     * Render the bound mesh detection filter.
     * Note: this method does not verify that the detection filter exists.
     */
    protected _renderDetectionFilter(renderer: PIXI.Renderer): void;

    override clear(): void;

    protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

    protected override _draw(options: HandleEmptyObject<Token.DrawOptions> | undefined): Promise<void>;

    protected override _applyRenderFlags(flags: Token.RenderFlags): void;

    /**
     * Refresh the token ring visuals if necessary.
     */
    protected _refreshRingVisuals(): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    /**
     * Refresh aspects of the user interaction state.
     * For example the border, nameplate, or bars may be shown on Hover or on Control.
     */
    protected _refreshState(): void;

    /**
     * Refresh the size.
     */
    protected _refreshSize(): void;

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
     * Refresh the token mesh.
     */
    protected _refreshMesh(): void;

    /**
     * Refresh the token mesh shader.
     */
    protected _refreshShader(): void;

    /**
     * Refresh the border.
     */
    protected _refreshBorder(): void;

    /**
     * Get the hex color that should be used to render the Token border
     * @returns The hex color used to depict the border color
     * @throws If this Token's Document somehow has an invalid `disposition`
     * @remarks Border colors set via `CONFIG.Canvas.dispositionColors`
     */
    protected _getBorderColor(): number;

    /**
     * Refresh the target indicators for the Token.
     * Draw both target arrows for the primary User and indicator pips for other Users targeting the same Token.
     * @param reticule - Additional parameters to configure how the targeting reticule is drawn.
     * @remarks Forwards `reticule` to {@link Token._drawTarget | `Token#_drawTarget`}
     */
    // reticule: not null (destructured in _drawTarget)
    protected _refreshTarget(reticule?: Token.ReticuleOptions): void;

    /**
     * Draw the targeting arrows around this token.
     * @param reticule - Additional parameters to configure how the targeting reticule is drawn.
     */
    // reticule: not null (destructured)
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
     * @remarks Called in {@link Token.drawBars | `Token#drawBars`} only after checking `data` for truthiness.
     *
     * Unconditionally returns `true`
     */
    protected _drawBar(
      number: number,
      bar: PIXI.Graphics,
      data: NonNullable<TokenDocument.GetBarAttributeReturn>,
    ): boolean;

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
    drawEffects(): Promise<this>;

    /**
     * Draw the effect icons for ActiveEffect documents which apply to the Token's Actor.
     * Called by {@link Token.drawEffects | `Token#drawEffects`}.
     */
    protected _drawEffects(): Promise<void>;

    /**
     * Draw a status effect icon
     * @param src  - Path to a texture
     * @param tint - A tint to apply to the returned sprite (default: `0xFFFFFF`)
     * @remarks Returns early if `src` is falsey, but otherwise calls {@linkcode loadTexture} with `{ fallback: "icons/svg/hazard.svg" }` and returns that
     */
    protected _drawEffect(src: string, tint?: number | null): Promise<PIXI.Sprite | undefined>;

    /**
     * Draw the overlay effect icon
     * @remarks Forwards both arguments to {@link Token._drawEffect | `Token#_drawEffect`}, and returns its output.
     */
    protected _drawOverlay(src: string, tint?: number | null): Promise<PIXI.Sprite | undefined>;

    /**
     * Refresh the display of status effects, adjusting their position for the token width and height.
     */
    protected _refreshEffects(): void;

    /**
     * Helper method to determine whether a token attribute is viewable under a certain mode
     * @param mode - The mode from CONST.TOKEN_DISPLAY_MODES
     * @returns Is the attribute viewable?
     */
    protected _canViewMode(mode: CONST.TOKEN_DISPLAY_MODES): boolean;

    /**
     * Override ring colors for this particular Token instance.
     * @remarks The return gets `mergeObject`ed over {@link TokenDocument.ring | `TokenDocument#ring#colors`}
     * in {@link foundry.canvas.tokens.TokenRing.configureVisuals | `TokenRing#configureVisuals`} and
     * {@link foundry.canvas.tokens.TokenRing.flashColor | `TokenRing#flashColor`}. Foundry's implementation returns `{}`
     */
    getRingColors(): Token.RingColors;

    /**
     * Apply additional ring effects for this particular Token instance.
     * Effects are returned as an array of integers in {@link foundry.canvas.tokens.TokenRing.effects}.
     * @remarks Additional effects to add over and above those in `CONFIG.Token.ring.effects`. Foundry's implementation returns `[]`
     */
    getRingEffects(): foundry.canvas.tokens.TokenRing.EFFECTS[];

    /**
     * Get the animation data for the current state of the document.
     * @returns The target animation data object
     */
    protected _getAnimationData(): Token.AnimationData;

    /**
     * Animate from the old to the new state of this Token.
     * @param to      - The animation data to animate to
     * @param options - The options that configure the animation behavior. Passed to {@link Token._getAnimationDuration | `Token#_getAnimationDuration`}.
     */
    // options: not null (destructured)
    animate(to: Token.PartialAnimationData, options?: Token.AnimateOptions): Promise<void>;

    /**
     * Get the duration of the animation.
     * @param from    - The animation data to animate from
     * @param to      - The animation data to animate to
     * @param options - The options that configure the animation behavior
     * @returns The duration of the animation in milliseconds
     */
    // options: not null (destructured)
    protected _getAnimationDuration(
      from: Token.AnimationDataForDuration,
      to: Token.PartialAnimationData,
      options?: Token.GetAnimationDurationOptions,
    ): number;

    /**
     * Called each animation frame.
     * @param changed - The animation data that changed
     * @param context - The animation context
     */
    protected _onAnimationUpdate(changed: Token.PartialAnimationData, context: Token.AnimationContext): void;

    /**
     * Terminate animation of this particular Token.
     */
    // options: not null (destructured)
    stopAnimation(options?: Token.StopAnimationOptions): void;

    /**
     * Prepare the animation data changes: performs special handling required for animating rotation.
     * @param from    - The animation data to animate from
     * @param changes - The animation data changes
     * @param context - The animation context
     * @param options - The options that configure the animation behavior
     * @returns The animation attributes
     */
    // options: not null (property access)
    protected _prepareAnimation(
      from: Token.AnimationDataForRotation,
      changes: Token.PartialAnimationData,
      context: Token.AnimationContext,
      options?: Token.PrepareAnimationOptions,
    ): CanvasAnimation.Attribute[];

    /**
     * Check for collision when attempting a move to a new position
     * @param destination - The central destination point of the attempted movement
     * @param options     - Additional options forwarded to {@link WallsLayer.checkCollision | `WallsLayer#checkCollision`}
     * @returns The result of the `WallsLayer#checkCollision` test
     */
    // options: not null (destructured)
    checkCollision<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>(
      destination: Canvas.Point,
      options?: Token.CheckCollisionOptions<Mode>,
    ): PointSourcePolygon.TestCollision<Coalesce<Mode, "any">>;

    /**
     * Get the width and height of the Token in pixels.
     * @returns The size in pixels
     */
    getSize(): Token.Size;

    /**
     * Get the shape of this Token.
     * @privateRemarks Foundry types this as possibly returning a `PIXI.Circle`, but it never does in practice in v12.
     * Not reported as this has changed in v13.
     */
    getShape(): PIXI.Rectangle | PIXI.Polygon;

    /**
     * Get the center point for a given position or the current position.
     * @param position - The position to be used instead of the current position (default: `this.document`)
     * @returns The center point
     */
    getCenterPoint(position?: Canvas.Point | null): Canvas.Point;

    override getSnappedPosition(position?: Canvas.Point | null): Canvas.Point;

    /**
     * Test whether the Token is inside the Region.
     * This function determines the state of {@link TokenDocument.regions | `TokenDocument#regions`} and {@link RegionDocument.tokens | `RegionDocument#tokens`}.
     *
     * Implementations of this function are restricted in the following ways:
     *   - If the bounds (given by {@link Token.getSize | `Token#getSize`}) of the Token do not intersect the Region, then the Token is not
     *     contained within the Region.
     *   - If the Token is inside the Region a particular elevation, then the Token is inside the Region at any elevation
     *     within the elevation range of the Region.
     *
     * If this function is overridden, then {@link Token.segmentizeRegionMovement | `Token#segmentizeRegionMovement`} must be overridden too.
     * @param region   - The region.
     * @param position - The (x, y) and/or elevation to use instead of the current values.
     * @returns Is the Token inside the Region?
     * @remarks `position` can be `{x, y}`, `{elevation}`, both, or neither. If either part is omitted, uses the document's value(s)
     */
    testInsideRegion(region: Region.Implementation, position?: Token.TestablePosition | null): boolean;

    /**
     * Split the Token movement through the waypoints into its segments.
     *
     * Implementations of this function are restricted in the following ways:
     *   - The segments must go through the waypoints.
     *   - The *from* position matches the *to* position of the succeeding segment.
     *   - The Token must be contained (w.r.t. {@link Token.testInsideRegion | `Token#testInsideRegion`}) within the Region
     *     at the *from* and *to* of MOVE segments.
     *   - The Token must be contained (w.r.t. {@link Token.testInsideRegion | `Token#testInsideRegion`}) within the Region
     *     at the *to* position of ENTER segments.
     *   - The Token must be contained (w.r.t. {@link Token.testInsideRegion | `Token#testInsideRegion`}) within the Region
     *     at the *from* position of EXIT segments.
     *   - The Token must not be contained (w.r.t. {@link Token.testInsideRegion | `Token#testInsideRegion`}) within the Region
     *     at the *from* position of ENTER segments.
     *   - The Token must not be contained (w.r.t. {@link Token.testInsideRegion | `Token#testInsideRegion`}) within the Region
     *     at the *to* position of EXIT segments.
     * @param region    - The region.
     * @param waypoints - The waypoints of movement.
     * @param options   - Additional options
     * @returns The movement split into its segments.
     */
    // options: not null (destructured)
    segmentizeRegionMovement(
      region: Region.Implementation,
      waypoints: Region.MovementWaypoint[],
      options?: Region.SegmentizeMovementOptions,
    ): Region.MovementSegment[];

    /**
     * Set this Token as an active target for the current game User
     * @param targeted - Is the Token now targeted? (default: `true`)
     * @param context  - Additional context options
     */
    // targeted: not null (!== check with a boolean), context: not null (destructured)
    setTarget(targeted?: boolean, context?: Token.TargetContext): void;

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

    protected override _getShiftedPosition(dx: number, dy: number): Canvas.Point;

    // options: not null (destructured)
    protected override _updateRotation(options?: PlaceableObject.UpdateRotationOptions): number;

    // _onCreate, _onUpdate, and _onDelete are overridden but with no signature changes.
    // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

    /**
     * Handle changes to Token behavior when a significant status effect is applied
     * @param statusId - The status effect ID being applied, from `CONFIG.specialStatusEffects`
     * @param active   - Is the special status effect now active?
     * @remarks Foundry marked `@internal`
     */
    protected _onApplyStatusEffect(statusId: string, active: boolean): void;

    /**
     * Add/Modify a filter effect on this token.
     * @param statusId - The status effect ID being applied, from `CONFIG.specialStatusEffects`
     * @param active   - Is the special status effect now active?
     * @remarks Foundry marked `@internal`
     */
    protected _configureFilterEffect(statusId: string, active: boolean): void;

    /**
     * Update the filter effects depending on special status effects
     * TODO: replace this method by something more convenient.
     * @remarks Foundry marked `@internal`. The TODO is theirs.
     */
    protected _updateSpecialStatusFilterEffects(): void;

    /**
     * Remove all filter effects on this placeable.
     * @remarks Foundry marked `@internal`
     */
    protected _removeAllFilterEffects(): void;

    protected override _onControl(options: Token.ControlOptions): void;

    protected override _onRelease(options: HandleEmptyObject<Token.ReleaseOptions>): void;

    protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

    protected override _canControl(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canHUD(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.Implementation, event: PIXI.FederatedEvent): true;

    protected override _canHover(user: User.Implementation, event: PIXI.FederatedEvent): true;

    protected override _canView(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canDrag(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    // options: not null (destructured)
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): void;

    protected override _onHoverOut(event: PIXI.FederatedEvent): void;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    protected override _propagateLeftClick(event: PIXI.FederatedEvent): boolean;

    protected override _onClickLeft2(event?: PIXI.FederatedEvent): void;

    protected override _onClickRight2(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): Token.DragLeftDropUpdate[];

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragEnd(): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "`Token#updatePosition` has been deprecated without replacement as it is no longer required."
     */
    updatePosition(): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "`Token#refreshHUD` is deprecated in favor of {@link RenderFlags.set | `token.renderFlags.set()`}"
     */
    // options: not null (destructured)
    refreshHUD(options?: Token.RefreshHUDOptions): void;

    /**
     * Update the light and vision source objects associated with this Token
     * @param options - Options which configure how perception sources are updated
     * @deprecated since v12, until v14
     * @remarks "`Token#updateSource` has been deprecated in favor of {@link Token.initializeSources | `Token#initializeSources`}"
     */
    // options: not null (destructured)
    updateSource(options?: Token.InitializeSourcesOptions): void;

    /**
     * Get the center-point coordinate for a given grid position
     * @param x - The grid x-coordinate that represents the top-left of the Token
     * @param y - The grid y-coordinate that represents the top-left of the Token
     * @returns The coordinate pair which represents the Token's center at position (x, y)
     * @deprecated since v12, until v14
     * @remarks "`Token#getCenter(x, y)` has been deprecated in favor of {@link Token.getCenterPoint | `Token#getCenterPoint(Point)`}."
     */
    getCenter(x: number, y: number): Canvas.Point;

    /**
     * A convenient reference for whether the current User has full control over the Token document.
     * @deprecated since v12, until v14
     * @remarks "`Token#owner` has been deprecated. Use {@link Token.isOwner | `Token#isOwner`} instead."
     */
    get owner(): boolean;

    /**
     * @deprecated since v12, until v14
     * @remarks "`Token#toggleCombat` is deprecated in favor of {@link TokenDocument.toggleCombatant | `TokenDocument#toggleCombatant`},
     * {@link TokenDocument.createCombatants | `TokenDocument.implementation.createCombatants`}, and
     * {@link TokenDocument.deleteCombatants | `TokenDocument.implementation.deleteCombatants`}"
     *
     * The `combat` parameter is unused. Creates Combatants for every Token controlled, plus the Token this was called on if it wasn't already controlled
     */
    toggleCombat(combat?: Combat.Implementation): Promise<Combatant.Stored[]>;

    /**
     * @deprecated since v12, until v14
     * @remarks "`Token#toggleEffect` is deprecated in favor of {@link Actor.toggleStatusEffect | `Actor#toggleStatusEffect`}"
     */
    // options: not null (destructured)
    toggleEffect(
      effect: CONFIG.StatusEffect,
      options?: Actor.ToggleStatusEffectOptions,
    ): Promise<ActiveEffect.Stored | boolean | undefined>;

    /**
     * @deprecated since v12, until v14
     * @remarks "`Token#toggleVisibility` is deprecated without replacement in favor of updating the {@link TokenDocument.hidden | `hidden` field of the `TokenDocument`} directly."
     */
    toggleVisibility(): Promise<TokenDocument.Stored[]>;

    /**
     * @deprecated since v12 Stable 4, until v14
     * @remarks "`Token#_recoverFromPreview` is deprecated without replacement in favor of recovering from preview directly into {@link TokenConfig._resetPreview | `TokenConfig#_resetPreview`}."
     */
    protected _recoverFromPreview(): void;
  }

  /**
   * A "secret" global to help debug attributes of the currently controlled Token.
   * This is only for debugging, and may be removed in the future, so it's not safe to use.
   */
  let _token: Token.Implementation | null;

  namespace Token {
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
    // eslint-disable-next-line no-restricted-syntax
    type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Token>;

    type Schema = BaseToken.Schema;
    type Parent = BaseToken.Parent;

    type Metadata = BaseToken.Metadata;

    export import UpdateData = BaseToken.UpdateData;
    export import Source = BaseToken.Source;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this, "redraw">;

      /** @defaultValue `{}` */
      redrawEffects: RenderFlag<this, "redrawEffects">;

      /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshMesh", "refreshNameplate", "refreshElevation", "refreshRingVisuals"], alias: true }` */
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

      /** @defaultValue `{}` */
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
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface Bars extends PIXI.Container {
      bar1: PIXI.Graphics;
      bar2: PIXI.Graphics;
    }

    /** @internal */
    type _GetMovementAdjustedPointOffsets = NullishProps<{
      /** @defaultValue `this.#priorMovement.ox` */
      offsetX: number;

      /** @defaultValue `this.#priorMovement.oy` */
      offsetY: number;
    }>;

    interface GetMovementAdjustedPointOffsets extends _GetMovementAdjustedPointOffsets {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    /** @internal */
    type _ControlOptions = NullishProps<{
      /** @defaultValue `false` */
      pan: boolean;
    }>;

    interface ControlOptions extends _ControlOptions, PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    /**
     * @remarks {@link Token._getLightSourceData | `Token#_getLightSourceData`} calls `mergeObject` on the return of
     * {@link foundry.data.LightData.toObject | `LightData#toObject(false)`} and the enumerated properties below and
     * returns the result. This gets passed to {@link foundry.canvas.sources.PointLightSource.initialize | `Token#light#initialize()`},
     * so this is a `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
     */
    type LightSourceData = foundry.data.fields.SchemaField.InitializedData<foundry.data.LightData.Schema> &
      RequiredProps<
        IntentionalPartial<foundry.canvas.sources.PointLightSource.SourceData>,
        "x" | "y" | "elevation" | "rotation" | "dim" | "bright" | "externalRadius" | "seed" | "preview" | "disabled"
      >;

    /**
     * @remarks The return of {@link Token._getVisionSourceData | `Token#_getVisionSourceData`}, which gets passed
     * to {@link foundry.canvas.sources.PointVisionSource.initialize | `Token#vision#initialize()`}, so this is a
     * `RequiredProps<IntentionalPartial<>>` rather than a `Pick<>`
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

    // TODO: (LukeAbby) possible candidate for `-=` key handling
    interface BlindedStates extends Record<string, boolean> {
      blind: boolean;
      burrow: boolean;
    }

    /** @internal */
    type _ReticuleOptions = NullishProps<{
      /**
       * The amount of margin between the targeting arrows and the token's bounding box, expressed as a fraction of an arrow's size.
       * @defaultValue `0`
       * @remarks This gets assigned to with `*=` before use, so `null` casting to the default of `0` is fine
       */
      margin: number;

      /**
       * The color of the arrows.
       * @defaultValue `this._getBorderColor()` {@link Token._getBorderColor | `Token#_getBorderColor`}
       */
      color: number;
    }> &
      InexactPartial<{
        /**
         * The alpha value of the arrows.
         * @defaultValue `1`
         * @remarks Can't be `null` as it only has a parameter default
         */
        alpha: number;

        /**
         * The size of the arrows as a proportion of grid size.
         * @defaultValue `0.15`
         * @remarks Can't be `null` as it only has a parameter default
         */
        size: number;

        /**
         * The arrows' border style configuration.
         * @defaultValue see properties
         * @remarks Can't be `null` as it's destructured in signature
         */
        border: InexactPartial<{
          /**
           * The border color.
           * @defaultValue `0`
           * @remarks Can't be `null` as it only has a parameter default
           */
          color: number;

          /**
           * The border width.
           * @defaultValue `2`
           * @remarks Can't be `null` as it only has a parameter default
           */
          width: number;
        }>;
      }>;
    interface ReticuleOptions extends _ReticuleOptions {}

    /**
     * The return type of {@link Token.getRingColors | `Token#getRingColors`}. Core's implementation returns `{}`.
     * Values returned by subclasses should not be nullish, as they are `mergeObject`'d into the default color values
     * from {@linkcode TokenRing.ConfiguredClass}
     */
    interface RingColors {
      ring?: Color;
      background?: Color;
    }

    /** @internal */
    type _AnimationData = Pick<TokenDocument.Implementation, "x" | "y" | "width" | "height" | "rotation" | "alpha"> & {
      /** The texture data. */
      texture: Pick<
        TokenDocument.Implementation["texture"],
        "src" | "anchorX" | "anchorY" | "scaleX" | "scaleY" | "tint"
      >;
    } & {
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
     * schema, and since the values returned by {@link Token._getAnimationData | `Token#_getAnimationData`}
     * are pulled directly from the document, this is also the most accurate typing.
     */
    interface AnimationData extends _AnimationData {}

    type PartialAnimationData = DeepPartial<AnimationData>;

    interface AnimationDataForDuration extends RequiredProps<PartialAnimationData, "x" | "y" | "rotation"> {}

    interface AnimationDataForRotation extends RequiredProps<PartialAnimationData, "rotation"> {}

    /** @internal */
    type _GetAnimationDurationOptions = InexactPartial<{
      /**
       * A desired token movement speed in grid spaces per second
       * @defaultValue `6`
       * @remarks Can't be `null` as it only has a parameter default
       */
      movementSpeed: number;
    }>;

    interface GetAnimationDurationOptions extends _GetAnimationDurationOptions {}

    /** @internal */
    type _PrepareAnimationOptions = NullishProps<{
      /**
       * The desired texture transition type
       * @defaultValue `TextureTransitionFilter.TYPES.FADE` (`"fade"`)
       */
      transition: TextureTransitionFilter.TYPES;
    }>;

    interface PrepareAnimationOptions extends _PrepareAnimationOptions {}

    /** @internal */
    type _AnimateOptions = Pick<CanvasAnimation.AnimateOptions, "duration" | "easing" | "name" | "ontick">;

    interface AnimateOptions extends _AnimateOptions, GetAnimationDurationOptions, PrepareAnimationOptions {}

    /** @internal */
    type _StopAnimationOptions = NullishProps<{
      /**
       * Reset the TokenDocument?
       * @defaultValue `false`
       */
      reset: boolean;
    }>;

    interface StopAnimationOptions extends _StopAnimationOptions {}

    /** @internal */
    type _CheckCollisionOptions<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined> =
      InexactPartial<{
        /**
         * The collision mode to test: "any", "all", or "closest"
         * @defaultValue `"any"`
         * @remarks Can't be `null` as it only has a parameter default
         */
        mode: Mode;

        /**
         * The collision type
         * @defaultValue `"move"`
         * @remarks Can't be `null` as it only has a parameter default
         *
         * `"sound"` is a valid source type but explicitly throws if passed, so omitted here
         */
        type: "move" | "sight" | "light";
      }> &
        NullishProps<{
          /**
           * The origin to be used instead of the current origin
           */
          origin: Canvas.Point;
        }>;

    interface CheckCollisionOptions<Mode extends PointSourcePolygon.CollisionModes | undefined = undefined>
      extends _CheckCollisionOptions<Mode> {}

    /** Return type of {@link Token.getSize | `Token#getSize`} */
    interface Size {
      width: number;
      height: number;
    }

    /**
     * @privateRemarks Foundry types this as `Point | (Point & {elevation: number}) | {elevation: number}`,
     * but this is misleading, as if an object is passed for the 2nd param of {@link Token.testInsideRegion | `Token#testInsideRegion`}
     * then it must contain `{x, y}` data, only if the value is nullish does the document's data get used.
     * Passing just `{elevation: number}` would result in `{x: undefined, y: undefined}`, causing
     * `PIXI.Rectangle#contains()` to always return false.
     *
     * Not reported, as `testInsideRegion` is deprecated and thus untyped in v13.
     */
    type TestablePosition = Canvas.Point & { elevation?: number };

    type _InitializeSourcesOptions = NullishProps<{
      /**
       * Indicate that this source has been deleted.
       * @defaultValue `false`
       */
      deleted: boolean;
    }>;

    interface InitializeSourcesOptions extends _InitializeSourcesOptions {}

    /** @internal */
    type _TargetContext = NullishProps<{
      /**
       * Assign the token as a target for a specific User
       * @defaultValue `game.user`
       * @remarks `null` is the parameter default, but it's `||=`d with `game.user`
       */
      user: User.Implementation;

      /**
       * Release other active targets for the same player?
       * @defaultValue `true`
       */
      releaseOthers: boolean;

      /**
       * Is this target being set as part of a group selection workflow?
       * @defaultValue `false`
       */
      groupSelection: boolean;
    }>;

    interface TargetContext extends _TargetContext {}

    interface AnimationContext {
      /** The name of the animation */
      name: PropertyKey;

      /**
       * The final animation state
       * @remarks This gets `mergeObject`ed with the return of {@link Token._getAnimationData | `Token#_getAnimationData`}
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

      /** Synchronous functions that are executed each frame after `ontick` and before {@link Token._onAnimationUpdate | `Token#_onAnimationUpdate`} */
      onAnimate: ((context: Token.AnimationContext) => void)[];

      /**
       * The promise of the animation, which resolves to true if the animation
       * completed, to false if it was terminated, and rejects if an error occurred.
       * Undefined in the first frame (at time 0) of the animation.
       */
      promise?: Promise<boolean> | undefined;
    }

    interface DragLeftDropUpdate {
      _id: string;
      x: number;
      y: number;
    }

    /** @internal */
    type _RefreshHUDOptions = NullishProps<{
      bars: boolean;
      border: boolean;
      elevation: boolean;
      nameplate: boolean;
      effects: boolean;
    }>;
    interface RefreshHUDOptions extends _RefreshHUDOptions {}
  }
}
