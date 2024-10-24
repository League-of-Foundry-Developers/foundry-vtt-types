export {};

declare global {
  /**
   * A container group which contains visual effects rendered above the primary group.
   */
  class EffectsCanvasGroup extends PIXI.Container {
    constructor();

    /**
     * Whether to currently animate light sources.
     */
    animateLightSources: boolean;

    /**
     * Whether to currently animate vision sources.
     */
    animateVisionSources: boolean;

    /**
     * A mapping of light sources which are active within the rendered Scene.
     */
    lightSources: Collection<foundry.canvas.sources.PointLightSource>;

    /**
     * A Collection of vision sources which are currently active within the rendered Scene.
     */
    visionSources: Collection<foundry.canvas.sources.PointVisionSource.Any>;

    /**
     * A set of vision mask filters used in visual effects group
     */
    visualEffectsMaskingFilters: Set<VisualEffectsMaskingFilter>;

    /**
     * A layer of background alteration effects which change the appearance of the primary group render texture.
     */
    background: CanvasBackgroundAlterationEffects;

    /**
     * A layer which adds illumination-based effects to the scene.
     */
    illumination: CanvasIlluminationEffects;

    /**
     * A layer which adds color-based effects to the scene.
     */
    coloration: CanvasColorationEffects;

    /**
     * A layer which controls the current visibility of the scene.
     */
    visibility: CanvasVisibility;

    /**
     * Clear all effects containers and animated sources.
     */
    clearEffects(): void;

    /**
     * Draw the component layers of the canvas group.
     */
    draw(): Promise<void>;

    /**
     * Actions to take when the darkness level is changed
     * @param darkness - The new darkness level
     * @param prior    - The prior darkness level
     * @internal
     */
    _onDarknessChange(darkness: number, prior: number): void;

    /**
     * Initialize LightSource objects for all AmbientLightDocument instances which exist within the active Scene.
     */
    initializeLightSources(): void;

    /**
     * Update the global light source which provides global illumination to the Scene.
     * @param options - Options which modify how the source is updated
     */
    updateGlobalLightSource(options: {
      /**
       * Defer updating perception to manually update it later
       * @defaultValue `false`
       */
      defer: boolean;
    }): void;

    /**
     * Refresh the state and uniforms of all LightSource objects.
     */
    refreshLightSources(): boolean;

    /**
     * Refresh the state and uniforms of all VisionSource objects.
     */
    refreshVisionSources(): boolean;

    /**
     * Refresh the active display of lighting.
     */
    refreshLighting(): boolean;

    /**
     * Perform a deconstruction workflow for this canvas group when the canvas is retired.
     */
    tearDown(): Promise<void>;

    /**
     * Activate vision masking for visual effects
     * @param enabled - Whether to enable or disable vision masking
     *                  (default: `true`)
     */
    toggleMaskingFilters(enabled: boolean): void;

    /**
     * Activate post-processing effects for a certain effects channel.
     * @param filterMode          - The filter mode to target.
     * @param postProcessingModes - The post-processing modes to apply to this filter.
     * @param uniforms            - The uniforms to update.
     */
    activatePostProcessingFilters(
      filterMode: VisualEffectsMaskingFilter.FilterMode,
      postProcessingModes: VisualEffectsMaskingFilter.PostProcessModes,
      uniforms: AbstractBaseShader.Uniforms,
    ): void;

    /**
     * Reset post-processing modes on all Visual Effects masking filters.
     */
    resetPostProcessingFilters(): void;

    /**
     * Activate light source animation for AmbientLight objects within this layer
     */
    activateAnimation(): void;

    /**
     * Deactivate light source animation for AmbientLight objects within this layer
     */
    deactivateAnimation(): void;

    /**
     * Animate a smooth transition of the darkness overlay to a target value.
     * Only begin animating if another animation is not already in progress.
     * @param target - The target darkness level between 0 and 1
     * @returns A Promise which resolves once the animation is complete
     */
    animateDarkness(
      target?: number,
      {
        duration,
      }?: {
        /**
         * The desired animation time in milliseconds. Default is 10 seconds
         * @defaultValue 10000
         */
        duration?: number;
      },
    ): ReturnType<(typeof CanvasAnimation)["animate"]>;
  }
}
