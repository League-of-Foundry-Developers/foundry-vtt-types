// FOUNDRY_VERSION: 10.291

/**
 * A container group which contains visual effects rendered above the primary group.
 *
 * ### Hook Events
 * - {@link hookEvents.drawEffectsCanvasGroup}
 * - {@link hookEvents.createEffectsCanvasGroup}
 * - {@link hookEvents.lightingRefresh}
 */
declare class EffectsCanvasGroup extends PIXI.Container {
  constructor();

  /**
   * The current global light source.
   */
  globalLightSource: LightSource;

  /**
   * Whether to currently animate light sources.
   * @defaultValue `true`
   */
  animateLightSources: boolean;

  /**
   * Whether to currently animate vision sources.
   * @defaultValue `true`
   */
  animateVisionSources: boolean;

  /**
   * A mapping of light sources which are active within the rendered Scene.
   * @defaultValue `new foundry.utils.Collection<LightSource>()`
   */
  lightSources: Collection<LightSource>;

  /**
   * A Collection of vision sources which are currently active within the rendered Scene.
   * @defaultValue `new foundry.utils.Collection<VisionSource>()`
   */
  visionSources: Collection<VisionSource>;

  /**
   * Create the child layers of the effects group.
   * @internal
   */
  #createLayers(): void;

  /**
   * Clear all effects containers and animated sources.
   */
  clearEffects(): void;

  /**
   * Draw the component layers of the canvas group.
   */
  draw(): Promise<void>;

  /**
   * Initialize LightSource objects for all AmbientLightDocument instances which exist within the active Scene.
   */
  initializeLightSources(): void;

  /**
   * Update the global light source which provide global illumination to the Scene.
   * @internal
   */
  protected _updateGlobalLightSource(): GlobalLightSource;

  /**
   * Refresh the state and uniforms of all LightSource objects.
   */
  refreshLightSources(): void;

  /**
   * Refresh the state and uniforms of all LightSource objects.
   */
  refreshVisionSources(): void;

  /**
   * Refresh the active display of lighting.
   */
  refreshLighting(): void;

  /**
   * Add effect meshes for active vision sources.
   * @internal
   */
  #addVisionEffects(): void;

  /**
   * Perform a deconstruction workflow for this canvas group when the canvas is retired.
   */
  tearDown(): Promise<void>;

  /**
   * Activate vision masking for visual effects
   * @param enabled   - Whether to enable or disable vision masking
   *                  (default: `true`)
   */
  toggleMaskingFilters(enabled?: boolean): void;

  /**
   * Activate post-processing effects for a certain effects channel.
   * @param filterMode            - The filter mode to target.
   * @param postProcessingModes   - The post-processing modes to apply to this filter.
   *                                (default: `[]`)
   * @param uniforms              - The uniforms to update.
   *                                (default: `{}`)
   */
  activatePostProcessingFilters(filterMode: string, postProcessingModes?: string[], uniforms?: Object): void;

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
   * The ticker handler which manages animation delegation
   * @param dt    - Delta time
   * @internal
   */
  #animateSources(dt: number): void;

  /**
   * Animate a smooth transition of the darkness overlay to a target value.
   * Only begin animating if another animation is not already in progress.
   * @param target   - The target darkness level between 0 and 1
   *                 default: `1.0`)
   * @param options  - default: `{}`
   * @returns        A Promise which resolves once the animation is complete
   */
  animateDarkness(
    target: number,
    options?: {
      /**
       * The desired animation time in milliseconds. Default is 10 seconds
       * @defaultValue `10000`
       */
      duration: number;
    }
  ): Promise<void>;
}
