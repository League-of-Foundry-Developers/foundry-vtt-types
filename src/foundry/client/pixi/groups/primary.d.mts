import type { Renderer } from "pixi.js";
import type { HandleEmptyObject } from "../../../../types/utils.d.mts";

// Included to match Foundry's documented types
type PrimaryCanvasObject = ReturnType<typeof PrimaryCanvasObjectMixin>;

declare global {
  /**
   * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
   * This group is a {@link CachedContainer} which is rendered to the Scene as a {@link SpriteMesh}.
   * This allows the rendered result of the Primary Canvas Group to be affected by a {@link BaseSamplerShader}.
   */
  class PrimaryCanvasGroup<
    DrawOptions extends PrimaryCanvasGroup.DrawOptions = PrimaryCanvasGroup.DrawOptions,
    TearDownOptions extends PrimaryCanvasGroup.TearDownOptions = PrimaryCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof CachedContainer, "primary">(CachedContainer)<DrawOptions, TearDownOptions> {
    /**
     * @param sprite - (default: `new SpriteMesh(undefined, BaseSamplerShader)`)
     */
    constructor(sprite?: SpriteMesh);

    /**
     * Sort order to break ties on the group/layer level.
     */
    static readonly SORT_LAYERS: PrimaryCanvasGroup.SORT_LAYERS;

    static override textureConfiguration: {
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
      multisample: PIXI.MSAA_QUALITY;
    };

    /**
     * @defaultValue `[0, 0, 0, 0]`
     * @remarks Actually an override of `CachedContainer#clearColor`
     */
    clearColor: [r: number, g: number, b: number, a: number];

    /**
     * The background color in RGB.
     */
    _backgroundColor: [red: number, green: number, blue: number] | undefined;

    /**
     * Track the set of HTMLVideoElements which are currently playing as part of this group.
     */
    videoMeshes: Set<SpriteMesh>;

    /**
     * Occludable objects above this elevation are faded on hover.
     * @defaultValue `0`
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
    background: SpriteMesh | undefined;

    /**
     * The primary foreground image configured for the Scene, rendered as a SpriteMesh.
     */
    foreground: SpriteMesh | undefined;

    /**
     * A Quadtree which partitions and organizes primary canvas objects.
     */
    quadtree: CanvasQuadtree;

    /**
     * The collection of PrimaryDrawingContainer objects which are rendered in the Scene.
     * @privateRemarks Foundry types this as `Collection<PrimaryDrawingContainer>`, which doesn't exist. It's `PrimaryGraphics` in practice.
     */
    drawings: Collection<PrimaryGraphics>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     * @privateRemarks Foundry types this as `Collection<TokenMesh>`, which doesn't exist. In practice it's `PrimarySpriteMesh`
     */
    tokens: Collection<PrimarySpriteMesh>;

    /**
     * The collection of SpriteMesh objects which are rendered in the Scene.
     * @privateRemarks Foundry types this as `Collection<PrimarySpriteMesh|TileSprite>`, but `TileSprite` doens't exist. In practice it's all `PrimarySpriteMesh`.
     */
    tiles: Collection<PrimarySpriteMesh>;

    /**
     * The ambience filter which is applying post-processing effects.
     */
    _ambienceFilter: PrimaryCanvasGroupAmbienceFilter | undefined;

    /**
     * Return the base HTML image or video element which provides the background texture.
     * @privateRemarks Foundry does not indicate the possibility of a null return
     */
    get backgroundSource(): HTMLImageElement | HTMLVideoElement | null;

    /**
     * Return the base HTML image or video element which provides the foreground texture.
     * @privateRemarks Foundry does not indicate the possibility of a null return
     */
    get foregroundSource(): HTMLImageElement | HTMLVideoElement | null;

    /**
     * Refresh the primary mesh.
     */
    refreshPrimarySpriteMesh(): void;

    /**
     * Update this group. Calculates the canvas transform and bounds of all its children and updates the quadtree.
     */
    update(): void;

    protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

    /** @remarks Actually an override `PIXI.Container#_render` */
    protected _render(_renderer: Renderer): void;

    protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param token - The Token being added
     * @returns The added PrimarySpriteMesh
     */
    addToken(token: Token.ConfiguredInstance): PrimarySpriteMesh;

    /**
     * Remove a TokenMesh from the group.
     * @param token - The Token being removed
     */
    removeToken(token: Token.ConfiguredInstance): void;

    /**
     * Draw the SpriteMesh for a specific Token object.
     * @param tile - The Tile being added
     * @returns The added PrimarySpriteMesh
     */
    addTile(tile: Tile.ConfiguredInstance): PrimarySpriteMesh;

    /**
     * Remove a TokenMesh from the group.
     * @param tile - The Tile being removed
     */
    removeTile(tile: Tile.ConfiguredInstance): void;

    /**
     * Add a PrimaryGraphics to the group.
     * @param drawing - The Drawing being added
     * @returns The created PrimaryGraphics instance
     */
    addDrawing(drawing: Drawing.ConfiguredInstance): PrimaryGraphics;

    /**
     * Remove a PrimaryGraphics from the group.
     * @param drawing - The Drawing being removed
     */
    removeDrawing(drawing: Drawing.ConfiguredInstance): void;

    /**
     * Override the default PIXI.Container behavior for how objects in this container are sorted.
     * @remarks Actually an override of `PIXI.Container#sortChildren`
     */
    sortChildren(): void;

    /**
     * Handle mousemove events on the primary group to update the hovered state of its children.
     * @remarks Public on purpose, called from `Canvas##onMouseMove`
     */
    _onMouseMove(): void;

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

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TeardownOptions {}

    interface SORT_LAYERS {
      readonly SCENE: 0;
      readonly TILES: 500;
      readonly DRAWINGS: 600;
      readonly TOKENS: 700;
      readonly WEATHER: 1000;
    }
  }
}

declare abstract class AnyPrimaryCanvasGroup extends PrimaryCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
