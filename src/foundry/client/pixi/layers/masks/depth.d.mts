export {};

declare global {
  /**
   * The depth mask which contains a mapping of elevation. Needed to know if we must render objects according to depth.
   */
  class CanvasDepthMask extends CachedContainer {
    /**
     * Container in which roofs are rendered with depth data.
     */
    roofs: PIXI.Container;

    /**
     * @defaultValue
     * ```js
     * {
     *   scaleMode: PIXI.SCALE_MODES.NEAREST,
     *   format: PIXI.FORMATS.RGB
     * }
     * ```
     */
    static override textureConfiguration: {
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
    };

    /**
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

    /**
     * Clear the depth mask.
     */
    clear(): void;
  }
}
