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

    vision: CanvasVisionMask.CanvasVisionContainer;
  }

  namespace CanvasVisionMask {
    type CanvasVisionContainer = {
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
    };
  }
}
