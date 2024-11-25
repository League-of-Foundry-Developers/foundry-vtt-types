export {};

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
    static override textureConfiguration: {
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
      multisample: PIXI.MSAA_QUALITY;
    };

    /**
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

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
     */
    blurFilter: AlphaBlurFilter | undefined;

    draw(): Promise<void>;

    /**
     * Initialize the vision mask with the los and the fov graphics objects.
     * @param vision - The vision container to attach
     */
    attachVision(vision: PIXI.Container): CanvasVisionMask.CanvasVisionContainer;

    /**
     * Detach the vision mask from the cached container.
     * @returns The detached vision container.
     */
    detachVision(): CanvasVisionMask.CanvasVisionContainer;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"CanvasVisionMask#filter has been renamed to blurFilter."`
     */
    get filter(): this["blurFilter"];

    set filter(f: AlphaBlurFilter);
  }

  namespace CanvasVisionMask {
    /**
     * The sight part of {@link CanvasVisionContainer}.
     * The blend mode is MAX_COLOR.
     */
    interface CanvasVisionContainerSight extends PIXI.LegacyGraphics {
      /** FOV that should not be committed to fog exploration. */
      preview: PIXI.LegacyGraphics;
    }

    /**
     * The light part of {@link CanvasVisionContainer}.
     * The blend mode is MAX_COLOR.
     */
    interface CanvasVisionContainerLight extends PIXI.LegacyGraphics {
      /** FOV that should not be committed to fog exploration. */
      preview: PIXI.LegacyGraphics;

      /** The sprite with the texture of FOV of cached light sources. */
      cached: SpriteMesh;

      /** The light perception polygons of vision sources and the FOV of vision sources that provide vision. */
      mask: PIXI.LegacyGraphics & { preview: PIXI.LegacyGraphics };
    }

    /**
     * The sight part of {@link CanvasVisionContainer}.
     * The blend mode is ERASE.
     */
    interface CanvasVisionContainerDarkness extends PIXI.LegacyGraphics {
      /** Darkness source erasing fog of war. */
      darkness: PIXI.LegacyGraphics;
    }

    /** The currently visible areas. */
    interface CanvasVisionContainer extends PIXI.Container {
      /** Areas visible because of light sources and light perception. */
      light: CanvasVisionContainerLight;

      /** Areas visible because of FOV of vision sources. */
      sight: CanvasVisionContainerSight;

      /** Areas erased by darkness sources. */
      darkness: CanvasVisionContainerDarkness;
    }
  }
}
