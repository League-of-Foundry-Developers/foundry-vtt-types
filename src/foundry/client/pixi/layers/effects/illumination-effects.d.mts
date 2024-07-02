export {};

declare global {
  /**
   * A CanvasLayer for displaying illumination visual effects
   */
  class CanvasIlluminationEffects extends CanvasLayer {
    /**
     * A minimalist texture that holds the background color.
     */
    backgroundColorTexture: PIXI.Texture;

    background: PIXI.LegacyGraphics;

    /**
     * @defaultValue `lights.sortableChildren = true`
     */
    lights: PIXI.Container;

    /**
     * Is global illumination currently applied to the canvas?
     */
    get globalLight(): boolean;

    /**
     * The filter used to mask visual effects on this layer
     */
    filter: VisualEffectsMaskingFilter;

    /**
     * Set or retrieve the illumination background color.
     */
    set backgroundColor(color: number);

    /**
     * Clear illumination effects container
     */
    clear(): void;

    /**
     * Create the background color texture used by illumination point source meshes.
     * 1x1 single pixel texture.
     * @returns The background color texture.
     * @defaultValue
     * ```js
     * PIXI.Texture.fromBuffer(new Float32Array(3), 1, 1, {
     *      type: PIXI.TYPES.FLOAT,
     *      format: PIXI.FORMATS.RGB,
     *      wrapMode: PIXI.WRAP_MODES.CLAMP,
     *      scaleMode: PIXI.SCALE_MODES.NEAREST,
     *      mipmap: PIXI.MIPMAP_MODES.OFF
     * })
     * ```
     */
    protected _createBackgroundColorTexture(): PIXI.Texture;

    override render(renderer: PIXI.Renderer): void;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _tearDown(options?: Record<string, unknown>): Promise<void>;

    /**
     * Draw illumination baseline
     */
    drawBaseline(): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "CanvasIlluminationEffects#updateGlobalLight has been deprecated."
     */
    updateGlobalLight(): false;
  }
}
