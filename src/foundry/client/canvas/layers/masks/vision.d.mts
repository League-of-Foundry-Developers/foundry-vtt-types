import type { Identity } from "#utils";
import type { AlphaBlurFilter, VoidFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type { CachedContainer, SpriteMesh } from "#client/canvas/containers/_module.d.mts";

/**
 * The vision mask which contains the current line-of-sight texture.
 */
declare class CanvasVisionMask extends CachedContainer {
  /**
   * @defaultValue
   * ```js
   * {
   *    scaleMode: PIXI.SCALE_MODES.NEAREST,
   *    format: PIXI.FORMATS.RED,
   *    multisample: PIXI.MSAA_QUALITY.NONE
   * }
   * ```
   */
  static override textureConfiguration: CachedContainer.TextureConfiguration;

  /**
   * @defaultValue `[0, 0, 0, 0]`
   */
  override clearColor: Color.RGBAColorVector;

  /**
   * @defaultValue `false`
   */
  override autoRender: boolean;

  /**
   * The current vision Container.
   * @defaultValue `undefined`
   * @remarks Set by {@linkcode CanvasVisionMask.attachVision | #attachVision}, cleared by
   * {@linkcode CanvasVisionMask.detachVision | #detachVision}; `undefined` while no vision container is attached.
   */
  vision: CanvasVisionMask.CanvasVisionContainer | undefined;

  /**
   * The BlurFilter which applies to the vision mask texture.
   * This filter applies a NORMAL blend mode to the container.
   * @defaultValue `undefined`
   * @remarks Remains `undefined` until a draw that happens while `canvas.blur.enabled` is `true`; a draw with blur
   * disabled removes any existing filter from `#filters` but leaves this property at its prior value.
   *
   * Could be overridden if anything ever set `canvas.blurOptions.blurClass`, but nothing in core does
   */
  blurFilter: AlphaBlurFilter | undefined;

  draw(): Promise<void>;

  /**
   * Initialize the vision mask with the los and the fov graphics objects.
   * @param vision - The vision container to attach
   * @remarks Foundry types `vision` as `PIXI.Container`, kept as-is here, though the only caller always passes an
   * already-built `CanvasVisionContainer`.
   */
  attachVision(vision: PIXI.Container): CanvasVisionMask.CanvasVisionContainer;

  /**
   * Detach the vision mask from the cached container.
   * @returns The detached vision container.
   */
  detachVision(): CanvasVisionMask.CanvasVisionContainer;
}

declare namespace CanvasVisionMask {
  interface Any extends AnyCanvasVisionMask {}
  interface AnyConstructor extends Identity<typeof AnyCanvasVisionMask> {}

  /**
   * The sight part of {@linkcode CanvasVisionContainer}.
   * The blend mode is {@linkcode PIXI.BLEND_MODES.MAX_COLOR | MAX_COLOR}.
   */
  interface CanvasVisionContainerSight extends PIXI.LegacyGraphics {
    /**
     * FOV that should not be committed to fog exploration.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    preview: PIXI.LegacyGraphics;

    /**
     * Surface exposure of vision sources.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}, `renderable` set to `false`
     */
    surfaceExposure: PIXI.LegacyGraphics;

    /**
     * Shared FoW for sight, not visible by default.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}, `visible` set to `false`
     */
    shared: PIXI.LegacyGraphics;
  }

  /** @remarks The global light container, which hold darkness level meshes for dynamic illumination */
  interface GlobalLightContainer extends PIXI.Container {
    /** @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR} */
    source: PIXI.LegacyGraphics;

    meshes: PIXI.Container;
  }

  /**
   * The light perception polygons of vision sources and the FOV of vision sources that provide vision.
   */
  interface LightMaskGraphics extends PIXI.LegacyGraphics {
    preview: PIXI.LegacyGraphics;

    /** @remarks Shared FoW for light sources; `visible` set to `false` */
    shared: PIXI.LegacyGraphics;

    /** @remarks Surface exposure of light sources that provide vision; `renderable` set to `false` */
    surfaceExposure: PIXI.LegacyGraphics;
  }

  /**
   * The light part of {@linkcode CanvasVisionContainer}.
   * The blend mode is {@linkcode PIXI.BLEND_MODES.MAX_COLOR | MAX_COLOR}.
   */
  interface CanvasVisionContainerLight extends PIXI.Container {
    /**
     * FOV that should not be committed to fog exploration.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    preview: PIXI.LegacyGraphics;

    /**
     * The sprite with the texture of FOV of cached light sources.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    cached: SpriteMesh;

    /**
     * The light perception polygons of vision sources and the FOV of vision sources that provide vision.
     */
    mask: LightMaskGraphics;

    /**
     * The global light container, which hold darkness level meshes for dynamic illumination
     */
    global: GlobalLightContainer;

    /**
     * The light sources
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    sources: PIXI.LegacyGraphics;

    /**
     * Surface exposure of light sources.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}, `renderable` set to `false`
     */
    surfaceExposure: PIXI.LegacyGraphics;
  }

  /**
   * The sight part of {@linkcode CanvasVisionContainer}.
   * The blend mode is {@linkcode PIXI.BLEND_MODES.ERASE | ERASE}.
   */
  interface CanvasVisionContainerDarkness extends PIXI.LegacyGraphics {}

  /** The currently visible areas. */
  interface CanvasVisionContainer extends PIXI.Container {
    /**
     * A void filter necessary when committing fog on a texture for dynamic illumination; disabled by default, used only when writing on textures
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    containmentFilter: VoidFilter;

    /** Areas visible because of light sources and light perception. */
    light: CanvasVisionContainerLight;

    /**
     * Areas visible because of FOV of vision sources.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.MAX_COLOR}
     */
    sight: CanvasVisionContainerSight;

    /**
     * Areas erased by darkness sources.
     * @remarks `blendMode` set to {@linkcode PIXI.BLEND_MODES.ERASE}
     */
    darkness: CanvasVisionContainerDarkness;
  }
}

export default CanvasVisionMask;

declare abstract class AnyCanvasVisionMask extends CanvasVisionMask {
  constructor(...args: never);
}
