import type { Brand, FixedInstanceType, HandleEmptyObject, Identity } from "#utils";
import type { PrimaryCanvasGroupAmbienceFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type { CachedContainer, SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { CanvasQuadtree } from "#client/canvas/geometry/quad-tree.d.mts";
import type { Drawing, Tile, Token } from "#client/canvas/placeables/_module.d.mts";
import type {
  PrimaryCanvasObjectMixin,
  PrimaryGraphics,
  PrimarySpriteMesh,
} from "#client/canvas/primary/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      PrimaryCanvasGroup: PrimaryCanvasGroup.Implementation;
    }
  }
}

/**
 * The primary Canvas group which generally contains tangible physical objects which exist within the Scene.
 * This group is a {@linkcode CachedContainer} which is rendered to the Scene as a {@linkcode SpriteMesh}.
 * This allows the rendered result of the Primary Canvas Group to be affected by a
 * {@linkcode foundry.canvas.rendering.shaders.BaseSamplerShader | BaseSamplerShader}.
 */
declare class PrimaryCanvasGroup<
  DrawOptions extends PrimaryCanvasGroup.DrawOptions = PrimaryCanvasGroup.DrawOptions,
  TearDownOptions extends PrimaryCanvasGroup.TearDownOptions = PrimaryCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof CachedContainer, "primary">(CachedContainer)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /**
   * @param sprite - (default: `new SpriteMesh(undefined, BaseSamplerShader)`)
   * @remarks Because `Canvas##createGroups` passes no arguments, this will always just use the default
   */
  constructor(sprite?: SpriteMesh);

  /**
   * @defaultValue `"none"`
   */
  override eventMode: PIXI.EventMode;

  /**
   * Sort order to break ties on the group/layer level.
   */
  static SORT_LAYERS: PrimaryCanvasGroup.Sort_Layers;

  /**
   * @defaultValue
   * ```js
   * {
   *   scaleMode: PIXI.SCALE_MODES.NEAREST,
   *   format: PIXI.FORMATS.RGB,
   *   multisample: PIXI.MSAA_QUALITY.NONE
   * }
   * ```
   */
  static override textureConfiguration: CachedContainer.TextureConfiguration;

  /**
   * @defaultValue `[0, 0, 0, 0]`
   */
  override clearColor: Color.RGBAColorVector;

  /**
   * The background color in RGB.
   * @internal
   */
  protected _backgroundColor: Color.RGBColorVector | undefined;

  /**
   * Track the set of HTMLVideoElements which are currently playing as part of this group.
   */
  videoMeshes: Set<PrimarySpriteMesh.Any>;

  /**
   * Occludable objects above this elevation are faded on hover.
   * @defaultValue `0`
   */
  hoverFadeElevation: number;

  /**
   * Allow API users to override the default elevation of the background layer.
   * This is a temporary solution until more formal support for scene levels is added in a future release.
   * @defaultValue `0`
   */
  static BACKGROUND_ELEVATION: number;

  /**
   * The primary background image configured for the Scene, rendered as a SpriteMesh.
   * @remarks Only `undefined` prior to first draw
   */
  background: PrimarySpriteMesh | undefined;

  /**
   * The primary foreground image configured for the Scene, rendered as a SpriteMesh.
   * @remarks Only `undefined` prior to first draw
   */
  foreground: PrimarySpriteMesh | undefined;

  /**
   * A Quadtree which partitions and organizes primary canvas objects.
   */
  quadtree: CanvasQuadtree<PrimaryCanvasObjectMixin.AnyMixed>;

  /**
   * The collection of PrimaryDrawingContainer objects which are rendered in the Scene.
   */
  drawings: Collection<PrimaryGraphics>;

  /**
   * The collection of SpriteMesh objects which are rendered in the Scene.
   * @privateRemarks Foundry types this as `Collection<TokenMesh>`, which doesn't exist. In practice it's `PrimarySpriteMesh`
   */
  tokens: Collection<PrimarySpriteMesh>;

  /**
   * The collection of SpriteMesh objects which are rendered in the Scene.
   * @privateRemarks Foundry types this as `Collection<PrimarySpriteMesh | TileSprite>`, but `TileSprite` doens't exist. In practice it's all `PrimarySpriteMesh`.
   */
  tiles: Collection<PrimarySpriteMesh>;

  /**
   * The ambience filter which is applying post-processing effects.
   * @internal
   */
  protected _ambienceFilter: PrimaryCanvasGroupAmbienceFilter | undefined;

  /**
   * Return the base HTML image or video element which provides the background texture.
   */
  get backgroundSource(): HTMLImageElement | HTMLVideoElement | null;

  /**
   * Return the base HTML image or video element which provides the foreground texture.
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

  protected override _render(renderer: PIXI.Renderer): void;

  protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

  /**
   * Draw the SpriteMesh for a specific Token object.
   * @param token - The Token being added
   * @returns The added PrimarySpriteMesh
   */
  addToken(token: Token.Implementation): PrimarySpriteMesh;

  /**
   * Remove a TokenMesh from the group.
   * @param token - The Token being removed
   */
  removeToken(token: Token.Implementation): void;

  /**
   * Draw the SpriteMesh for a specific Token object.
   * @param tile - The Tile being added
   * @returns The added PrimarySpriteMesh
   */
  addTile(tile: Tile.Implementation): PrimarySpriteMesh;

  /**
   * Remove a TokenMesh from the group.
   * @param tile - The Tile being removed
   */
  removeTile(tile: Tile.Implementation): void;

  /**
   * Add a PrimaryGraphics to the group.
   * @param drawing - The Drawing being added
   * @returns The created PrimaryGraphics instance
   */
  addDrawing(drawing: Drawing.Implementation): PrimaryGraphics;

  /**
   * Remove a PrimaryGraphics from the group.
   * @param drawing - The Drawing being removed
   */
  removeDrawing(drawing: Drawing.Implementation): void;

  /**
   * Override the default PIXI.Container behavior for how objects in this container are sorted.
   */
  override sortChildren(): void;

  /**
   * The sorting function used to order objects inside the Primary Canvas Group.
   * Overrides the default sorting function defined for the PIXI.Container.
   * Sort Tokens PCO above other objects except WeatherEffects, then Drawings PCO, all else held equal.
   * @param a - An object to display
   * @param b - Some other object to display
   * @internal
   */
  protected static _compareObjects(
    a: PrimaryCanvasObjectMixin.AnyMixed | PIXI.DisplayObject,
    b: PrimaryCanvasObjectMixin.AnyMixed | PIXI.DisplayObject,
  ): number;

  /**
   * Handle mousemove events on the primary group to update the hovered state of its children.
   * @param currentPos    - Current mouse position
   * @param hasMouseMoved - Has the mouse been moved (or it is a simulated mouse move event)?
   * @internal
   */
  protected _onMouseMove(currentPos: PIXI.Point, hasMouseMoved: boolean): void;

  /**
   * @deprecated "`PrimaryCanvasGroup#mapElevationAlpha` is deprecated. Use {@linkcode foundry.canvas.layers.CanvasDepthMask.mapElevation | canvas.masks.depth.mapElevation(elevation)}
   * instead." (since v12, until v14)
   */
  mapElevationToDepth(elevation: number): number;

  #PrimaryCanvasGroup: true;
}

declare namespace PrimaryCanvasGroup {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyPrimaryCanvasGroup {}
    interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasGroup> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.primary.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}

  type SORT_LAYERS = Brand<number, "PrimaryCanvasGroup.SORT_LAYERS">;

  interface Sort_Layers {
    readonly SCENE: 0 & SORT_LAYERS;
    readonly TILES: 500 & SORT_LAYERS;
    readonly DRAWINGS: 600 & SORT_LAYERS;
    readonly TOKENS: 700 & SORT_LAYERS;
    readonly WEATHER: 1000 & SORT_LAYERS;
  }
}

export default PrimaryCanvasGroup;

declare abstract class AnyPrimaryCanvasGroup extends PrimaryCanvasGroup {
  constructor(...args: never);
}
