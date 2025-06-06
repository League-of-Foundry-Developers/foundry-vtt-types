import type { Identity } from "#utils";
// TODO: following import is temporary pending a proper v13 pass on this file
import type AlphaBlurFilter from "#client/canvas/rendering/filters/blur.mjs";
import type { VoidFilter } from "#client/canvas/rendering/filters/_module.d.mts";

declare global {
  /**
   * The vision mask which contains the current line-of-sight texture.
   */
  class CanvasVisionMask extends CachedContainer {
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
     */
    vision: CanvasVisionMask.CanvasVisionContainer | undefined;

    /**
     * The BlurFilter which applies to the vision mask texture.
     * This filter applies a NORMAL blend mode to the container.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     *
     * Could be overridden if anything ever set `canvas.blurOptions.blurClass`, but nothing in core does
     */
    blurFilter: AlphaBlurFilter | undefined;

    draw(): Promise<void>;

    /**
     * Initialize the vision mask with the los and the fov graphics objects.
     * @param vision - The vision container to attach
     */
    attachVision(vision: CanvasVisionMask.CanvasVisionContainer): CanvasVisionMask.CanvasVisionContainer;

    /**
     * Detach the vision mask from the cached container.
     * @returns The detached vision container.
     */
    detachVision(): CanvasVisionMask.CanvasVisionContainer;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "CanvasVisionMask#filter has been renamed to blurFilter."
     */
    get filter(): this["blurFilter"];

    set filter(f: AlphaBlurFilter);
  }

  namespace CanvasVisionMask {
    interface Any extends AnyCanvasVisionMask {}
    interface AnyConstructor extends Identity<typeof AnyCanvasVisionMask> {}

    /**
     * The sight part of {@linkcode CanvasVisionContainer}.
     * The blend mode is MAX_COLOR.
     */
    interface CanvasVisionContainerSight extends PIXI.LegacyGraphics {
      /**
       * FOV that should not be committed to fog exploration.
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      preview: PIXI.LegacyGraphics;
    }

    interface GlobalLightContainer extends PIXI.Container {
      /** @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR` */
      source: PIXI.LegacyGraphics;

      meshes: PIXI.Container;
    }

    interface LightMaskGraphics extends PIXI.LegacyGraphics {
      preview: PIXI.LegacyGraphics;
    }

    /**
     * The light part of {@linkcode CanvasVisionContainer}.
     * The blend mode is MAX_COLOR.
     */
    interface CanvasVisionContainerLight extends PIXI.LegacyGraphics {
      /**
       * FOV that should not be committed to fog exploration.
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      preview: PIXI.LegacyGraphics;

      /**
       * The sprite with the texture of FOV of cached light sources.
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      cached: SpriteMesh;

      /** The light perception polygons of vision sources and the FOV of vision sources that provide vision. */
      mask: LightMaskGraphics;

      /**
       * The global light container, which hold darkness level meshes for dynamic illumination
       */
      global: GlobalLightContainer;

      /**
       * The light sources
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      sources: PIXI.LegacyGraphics;

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#fov#lights is deprecated without replacement."
       */
      readonly lights: PIXI.LegacyGraphics;

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#fov#lightsSprite is deprecated in favor of CanvasVisibility#vision#light#cached."
       */
      readonly lightsSprite: SpriteMesh;

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#fov#tokens is deprecated in favor of CanvasVisibility#vision#light."d
       */
      readonly tokens: this;
    }

    /**
     * The sight part of {@linkcode CanvasVisionContainer}.
     * The blend mode is ERASE.
     */
    interface CanvasVisionContainerDarkness extends PIXI.LegacyGraphics {
      /** Darkness source erasing fog of war. */
      darkness: PIXI.LegacyGraphics;
    }

    /** The currently visible areas. */
    interface CanvasVisionContainer extends PIXI.Container {
      /**
       * @remarks A void filter necessary when commiting fog on a texture for dynamic illumination; disabled by default
       *
       * `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      containmentFilter: VoidFilter;

      /** Areas visible because of light sources and light perception. */
      light: CanvasVisionContainerLight;

      /**
       * Areas visible because of FOV of vision sources.
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.MAX_COLOR`
       */
      sight: CanvasVisionContainerSight;

      /**
       * Areas erased by darkness sources.
       * @remarks `blendMode` set to `PIXI.BLEND_MODES.ERASE`
       */
      darkness: CanvasVisionContainerDarkness;

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#base is deprecated in favor of CanvasVisibility#vision#light#preview."
       */
      readonly base: CanvasVisionContainerLight["preview"];

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#fov is deprecated in favor of CanvasVisibility#vision#light."
       */
      readonly fov: CanvasVisionContainerLight;

      /**
       * @deprecated since v12, until 14
       * @remarks "CanvasVisibility#vision#los is deprecated in favor of CanvasVisibility#vision#light#mask."
       */
      readonly los: CanvasVisionContainerLight["mask"];
    }
  }
}

declare abstract class AnyCanvasVisionMask extends CanvasVisionMask {
  constructor(...args: never);
}
