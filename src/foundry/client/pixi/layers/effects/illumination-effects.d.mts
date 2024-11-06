import type { NullishProps } from "../../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * A CanvasLayer for displaying illumination visual effects
   */
  class CanvasIlluminationEffects extends CanvasLayer {
    /**
     * The filter used to mask visual effects on this layer
     */
    filter: VisualEffectsMaskingFilter;

    /**
     * The container holding the lights.
     */
    lights: PIXI.Container;

    /**
     * A minimalist texture that holds the background color.
     */
    backgroundColorTexture: PIXI.Texture;

    /**
     * The base line mesh.
     */
    baselineMesh: SpriteMesh;

    /**
     * The cached container holding the illumination meshes.
     */
    darknessLevelMeshes: DarknessLevelContainer;

    /**
     * To know if dynamic darkness level is active on this scene.
     */
    get hasDynamicDarknessLevel(): boolean;

    /**
     * The illumination render texture.
     */
    get renderTexture(): PIXI.RenderTexture;

    /**
     * Set or retrieve the illumination background color.
     */
    set backgroundColor(color: number);

    /**
     * Clear illumination effects container
     */
    clear(): void;

    /**
     * Invalidate the cached container state to trigger a render pass.
     * @param force - Force cached container invalidation?
     *                (default: `false`)
     */
    invalidateDarknessLevelContainer(force: boolean): void;

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
     * @deprecated since v11, will be removed in v13
     * @remarks "CanvasIlluminationEffects#updateGlobalLight has been deprecated."
     */
    updateGlobalLight(): false;

    /**
     * @deprecated since v12, will be removed in v14
     */
    background: PIXI.LegacyGraphics;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"CanvasIlluminationEffects#globalLight has been deprecated without replacement. Check the canvas.environment.globalLightSource.active instead."`
     */
    get globalLight(): boolean;
  }

  /**
   * Cached container used for dynamic darkness level. Display objects (of any type) added to this cached container will
   * contribute to computing the darkness level of the masked area. Only the red channel is utilized, which corresponds
   * to the desired darkness level. Other channels are ignored.
   */
  class DarknessLevelContainer extends CachedContainer {
    /**
     * @defaultValue
     * ```js
     * {
     *  scaleMode: PIXI.SCALE_MODES.NEAREST,
     *  format: PIXI.FORMATS.RED,
     *  multisample: PIXI.MSAA_QUALITY.NONE,
     *  mipmap: PIXI.MIPMAP_MODES.OFF
     * }
     * ```
     */
    static override textureConfiguration: NullishProps<{
      multisample: PIXI.MSAA_QUALITY;
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
      mipmap: PIXI.MIPMAP_MODES;
    }>;

    /** @privateRemarks Including to protect duck typing due to overall similarities b/w DarknessLevelContainer and CachedContainer */
    #onChildChange(): void;
  }
}
