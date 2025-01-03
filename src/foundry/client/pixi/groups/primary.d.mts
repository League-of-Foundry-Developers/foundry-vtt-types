import type { Renderer } from "pixi.js";

// Included to match Foundry's documented types
type PrimaryCanvasObject = ReturnType<typeof PrimaryCanvasObjectMixin>;

declare global {
  /**
   * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
   * This group is a {@link CachedContainer} which is rendered to the Scene as a {@link SpriteMesh}.
   * This allows the rendered result of the Primary Canvas Group to be affected by a {@link BaseSamplerShader}.
   */
  class PrimaryCanvasGroup extends CanvasGroupMixin<typeof CachedContainer, "primary">(CachedContainer) {
    /**
     * @param sprite - (default: `new SpriteMesh(undefined, BaseSamplerShader)`)
     */
    constructor(sprite?: SpriteMesh);

    /**
     * Sort order to break ties on the group/layer level.
     */
    static readonly SORT_LAYERS: {
      SCENE: number;
      TILES: number;
      DRAWINGS: number;
      TOKENS: number;
      WEATHER: number;
    };

    static override textureConfiguration: {
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
      multisample: PIXI.MSAA_QUALITY;
    };

    /**
     * @defaultValue `"none"`
     */
    override eventMode: PIXI.EventMode;

    /**
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

    /**
     * The background color in RGB.
     */
    _backgroundColor?: [red: number, green: number, blue: number];

    /**
     * Track the set of HTMLVideoElements which are currently playing as part of this group.
     */
    videoMeshes: Set<SpriteMesh>;

    /**
     * Occludable objects above this elevation are faded on hover.
     */
    hoverFadeElevation: number;

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
    drawings: Collection<PrimaryGraphics>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     */
    tokens: Collection<PrimarySpriteMesh>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     */
    tiles: Collection<PrimarySpriteMesh>;

    /**
     * The ambience filter which is applying post-processing effects.
     */
    _ambienceFilter: PrimaryCanvasGroupAmbienceFilter;

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
     * Update this group. Calculates the canvas transform and bounds of all its children and updates the quadtree.
     */
    update(): void;

    protected override _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

    protected override _render(_renderer: Renderer): void;

    protected override _tearDown(options: CanvasGroupMixin.TearDownOptions): Promise<void>;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param token - The Token being added
     * @returns The added PrimarySpriteMesh
     */
    addToken(token: Token): PrimarySpriteMesh;

    /**
     * Remove a TokenMesh from the group.
     * @param token - The Token being removed
     */
    removeToken(token: Token): void;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param tile - The Tile being added
     * @returns The added PrimarySpriteMesh
     */
    addTile(tile: Tile): PrimarySpriteMesh;

    /**
     * Remove a TokenMesh from the group.
     * @param tile - The Tile being removed
     */
    removeTile(tile: Tile): void;

    /**
     * Add a PrimaryGraphics to the group.
     * @param drawing - The Drawing being added
     * @returns The created PrimaryGraphics instance
     */
    addDrawing(drawing: Drawing): PrimaryGraphics;

    /**
     * Remove a PrimaryGraphics from the group.
     * @param drawing - The Drawing being removed
     */
    removeDrawing(drawing: Drawing): void;

    /**
     * Override the default PIXI.Container behavior for how objects in this container are sorted.
     * @override
     */
    sortChildren(): void;

    /**
     * Handle mousemove events on the primary group to update the hovered state of its children.
     */
    protected _onMouseMove(): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"PrimaryCanvasGroup#mapElevationAlpha is deprecated. Use canvas.masks.depth.mapElevation(elevation) instead."`
     */
    mapElevationToDepth(elevation: number): number;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "PrimaryCanvasGroup#mapElevationAlpha is deprecated in favor of PrimaryCanvasGroup#mapElevationToDepth"
     */
    mapElevationAlpha(elevation: number): number;
  }

  namespace PrimaryCanvasGroup {
    type Any = AnyPrimaryCanvasGroup;
    type AnyConstructor = typeof AnyPrimaryCanvasGroup;
  }
}

declare abstract class AnyPrimaryCanvasGroup extends PrimaryCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
