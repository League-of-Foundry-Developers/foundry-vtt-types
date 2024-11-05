import type { ValueOf } from "../../../../types/utils.d.mts";

// TODO: Remove after layer is defined by #2841
type CanvasDarknessEffects = CanvasLayer;

declare global {
  /**
   * A container group which contains visual effects rendered above the primary group.
   */
  class EffectsCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
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
     * A mapping of darkness sources which are active within the rendered Scene.
     */
    darknessSources: Collection<foundry.canvas.sources.PointDarknessSource>;

    /**
     * A Collection of vision sources which are currently active within the rendered Scene.
     */
    visionSources: Collection<foundry.canvas.sources.PointVisionSource.Any>;

    /**
     * A set of vision mask filters used in visual effects group
     */
    visualEffectsMaskingFilters: Set<VisualEffectsMaskingFilter>;

    /**
     * Iterator for all light and darkness sources.
     */
    allSources(): Generator<
      foundry.canvas.sources.PointDarknessSource | foundry.canvas.sources.PointLightSource,
      void,
      void
    >;

    override _createLayers(): Record<string, CanvasLayer>;

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
     * A layer which adds darkness effects to the scene.
     */
    darkness: CanvasDarknessEffects;

    /**
     * Clear all effects containers and animated sources.
     */
    clearEffects(): void;

    protected override _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

    /**
     * Initialize positive light sources which exist within the active Scene.
     * Packages can use the "initializeLightSources" hook to programmatically add light sources.
     */
    initializeLightSources(): void;

    /**
     * Re-initialize the shapes of all darkness sources in the Scene.
     * This happens before initialization of light sources because darkness sources contribute additional edges which
     * limit perception.
     * Packages can use the "initializeDarknessSources" hook to programmatically add darkness sources.
     */
    initializeDarknessSources(): void;

    /**
     * Refresh the state and uniforms of all light sources and darkness sources objects.
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
     * Test whether the point is inside light.
     * @param point     - The point.
     * @param elevation - The elevation of the point.
     * @returns Is inside light?
     */
    testInsideLight(point: Point, elevation: number): boolean;

    /**
     * Test whether the point is inside darkness.
     * @param point     - The point.
     * @param elevation - The elevation of the point.
     * @returns Is inside darkness?
     */
    testInsideDarkness(point: Point, elevation: number): boolean;

    /**
     * Get the darkness level at the given point.
     * @param point     - The point.
     * @param elevation - The elevation of the point.
     * @returns The darkness level.
     */
    getDarknessLevel(point: Point, elevation: number): number;

    override _tearDown(options: CanvasGroupMixin.TearDownOptions): Promise<void>;

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
      filterMode: ValueOf<VisualEffectsMaskingFilter.FILTER_MODES>,
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
