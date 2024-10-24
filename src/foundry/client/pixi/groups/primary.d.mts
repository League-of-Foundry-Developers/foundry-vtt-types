export {};

// Included to match Foundry's documented types
type PrimaryCanvasObject = ReturnType<typeof PrimaryCanvasObjectMixin>;

declare global {
  /**
   * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
   * This group is a {@link CachedContainer} which is rendered to the Scene as a {@link SpriteMesh}.
   * This allows the rendered result of the Primary Canvas Group to be affected by a {@link BaseSamplerShader}.
   */
  class PrimaryCanvasGroup extends CanvasGroupMixin(CachedContainer) {
    /**
     * @param sprite - (default: `new SpriteMesh(undefined, BaseSamplerShader)`)
     */
    constructor(sprite?: SpriteMesh);

    /**
     * @defaultValue `"primary"`
     */
    static override groupName: string;

    /**
     * @defaultValue `"none"`
     */
    override eventMode: PIXI.EventMode;

    /**
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

    /**
     * Track the set of HTMLVideoElements which are currently playing as part of this group.
     */
    videoMeshes: Set<SpriteMesh>;

    /**
     * Allow API users to override the default elevation of the background layer.
     * This is a temporary solution until more formal support for scene levels is added in a future release.
     */
    static BACKGROUND_ELEVATION: number;

    /**
     * The primary background image configured for the Scene, rendered as a SpriteMesh.
     */
    background: SpriteMesh;

    /**
     * The primary foreground image configured for the Scene, rendered as a SpriteMesh.
     */
    foreground: SpriteMesh;

    /**
     * A Quadtree which partitions and organizes primary canvas objects.
     */
    quadtree: CanvasQuadtree;

    /**
     * The collection of PrimaryDrawingContainer objects which are rendered in the Scene.
     */
    drawings: Collection<DrawingShape>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     */
    tokens: Collection<TokenMesh>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     */
    tiles: Collection<TileMesh | TileSprite>;

    /**
     * Render all tokens in their own render texture.
     * @param renderer - The renderer to use.
     */
    _renderTokens(renderer: PIXI.Renderer): void;

    /**
     * Return the base HTML image or video element which provides the background texture.
     */
    get backgroundSource(): HTMLImageElement | HTMLVideoElement;

    /**
     * Return the base HTML image or video element which provides the foreground texture.
     */
    get foregroundSource(): HTMLImageElement | HTMLVideoElement;

    /**
     * Refresh the primary mesh.
     */
    refreshPrimarySpriteMesh(): void;

    /**
     * Draw the canvas group and all its component layers.
     */
    draw(): Promise<void>;

    /**
     * Remove and destroy all children from the group.
     * Clear container references to rendered objects.
     */
    tearDown(): Promise<void>;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param token - The Token being added
     * @returns The added TokenMesh
     */
    addToken(token: Token): TokenMesh;

    /**
     * Remove a TokenMesh from the group.
     * @param token - The Token being removed
     */
    removeToken(token: Token): void;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param tile - The Tile being added
     * @returns The added TileMesh or TileSprite
     */
    addTile(tile: Tile): TileMesh | TileSprite;

    /**
     * Remove a TokenMesh from the group.
     * @param tile - The Tile being removed
     */
    removeTile(tile: Tile): void;

    /**
     * Add a DrawingShape to the group.
     * @param drawing - The Drawing being added
     * @returns The created DrawingShape instance
     */
    addDrawing(drawing: Drawing): DrawingShape;

    /**
     * Remove a DrawingShape from the group.
     * @param drawing - The Drawing being removed
     */
    removeDrawing(drawing: Drawing): void;

    /**
     * Map an elevation value to a depth value with the right precision.
     * @param elevation - A current elevation (or zIndex) in distance units.
     * @returns The depth value for this elevation on the range [1/255, 1]
     */
    mapElevationToDepth(elevation: number): number;

    /**
     * Override the default PIXI.Container behavior for how objects in this container are sorted.
     * @override
     */
    sortChildren(): void;

    /**
     * The sorting function used to order objects inside the Primary Canvas Group.
     * Overrides the default sorting function defined for the PIXI.Container.
     * Sort TokenMesh above other objects except WeatherEffects, then DrawingShape, all else held equal.
     * @param a - An object to display
     * @param b - Some other object to display
     */
    static _sortObjects(
      a: PrimaryCanvasObject | PIXI.DisplayObject,
      b: PrimaryCanvasObject | PIXI.DisplayObject,
    ): number;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "PrimaryCanvasGroup#mapElevationAlpha is deprecated in favor of PrimaryCanvasGroup#mapElevationToDepth"
     */
    mapElevationAlpha(elevation: number): number;
  }
}
