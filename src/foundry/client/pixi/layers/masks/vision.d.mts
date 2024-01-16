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
     *    format: PIXI.FORMATS.RED
     * }
     * ```
     */
    static override textureConfiguration: {
      multisample: PIXI.MSAA_QUALITY;
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
    };

    /**
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

    vision: CanvasVisionContainer;

    /**
     * The BlurFilter which applies to the vision mask texture.
     * This filter applies a NORMAL blend mode to the container.
     */
    blurFilter: AlphaBlurFilter;

    draw(): Promise<void>;

    /**
     * Initialize the vision mask with the los and the fov graphics objects.
     * @param vision - The vision container to attach
     */
    attachVision(vision: PIXI.Container): CanvasVisionContainer;

    /**
     * Detach the vision mask from the cached container.
     * @returns The detached vision container.
     */
    detachVision(): CanvasVisionContainer;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"CanvasVisionMask#filter has been renamed to blurFilter."`
     */
    get filter(): this["blurFilter"];

    set filter(f);
  }

  interface CanvasVisionContainer {
    /**
     * LOS polygons
     */
    los: PIXI.Graphics;

    /**
     * Base vision
     */
    base: PIXI.Graphics;

    /**
     * FOV polygons
     */
    fov: PIXI.Graphics;

    /**
     * Alias of los
     */
    mask: PIXI.Graphics;

    /**
     * Does this vision point represent an explored position?
     */
    _explored: boolean;
  }
}
