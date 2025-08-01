import type { FixedInstanceType, HandleEmptyObject, Identity, InexactPartial } from "#utils";
import type { Canvas, sources } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type { CanvasGroupMixin, CanvasVisibility, EnvironmentCanvasGroup } from "#client/canvas/groups/_module.d.mts";
import type * as layers from "#client/canvas/layers/_module.d.mts";
// Only used for, and aliased to match, foundry's links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks as hookEvents } from "#client/hooks.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      EffectsCanvasGroup: EffectsCanvasGroup.Implementation;
    }
  }
}

/**
 * A container group which contains visual effects rendered above the primary group.
 *
 * TODO:
 *  The effects canvas group is now only performing shape initialization, logic that needs to happen at
 *  the placeable or object level is now their burden.
 *  - [DONE] Adding or removing a source from the EffectsCanvasGroup collection.
 *  - [TODO] A change in a darkness source should re-initialize all overlapping light and vision source.
 *
 * ### Hook Events
 * - {@linkcode hookEvents.lightingRefresh}
 */
declare class EffectsCanvasGroup<
  DrawOptions extends EffectsCanvasGroup.DrawOptions = EffectsCanvasGroup.DrawOptions,
  TearDownOptions extends EffectsCanvasGroup.TearDownOptions = EffectsCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

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
   * @remarks Foundry always initializes prior to adding to this collection
   */
  // TODO: Make .InitializedImplementation when https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3438 is completed
  lightSources: Collection<sources.PointLightSource.Any>;

  /**
   * A mapping of darkness sources which are active within the rendered Scene.
   * @remarks Foundry always initializes prior to adding to this collection
   */
  // TODO: Make .InitializedImplementation
  darknessSources: Collection<sources.PointDarknessSource.Any>;

  /**
   * A Collection of vision sources which are currently active within the rendered Scene.
   * @remarks Foundry always initializes prior to adding to this collection
   */
  // TODO: Make .InitializedImplementation
  visionSources: Collection<sources.PointVisionSource.Any>;

  /**
   * A set of vision mask filters used in visual effects group
   */
  visualEffectsMaskingFilters: Set<VisualEffectsMaskingFilter.Implementation>;

  /**
   * Iterator for all light and darkness sources.
   */
  // TODO: Make .InitializedImplementation
  allSources(): Generator<sources.PointDarknessSource.Any | sources.PointLightSource.Any, void, undefined>;

  /**
   * @remarks `EffectsCanvasGroup` doesn't use the same dynamic layer property assignment as other groups, instead this returns
   * an object with known keys ({@linkcode background}, {@linkcode illumination}, {@linkcode coloration}, and {@linkcode darkness})
   */
  protected override _createLayers(): EffectsCanvasGroup.Layers;

  /** @privateRemarks Fake override to sync with {@linkcode _createLayers} */
  override layers: EffectsCanvasGroup.Layers;

  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  background: layers.CanvasBackgroundAlterationEffects.Any;

  /**
   * A layer which adds illumination-based effects to the scene.
   */
  illumination: layers.CanvasIlluminationEffects.Any;

  /**
   * A layer which adds color-based effects to the scene.
   */
  coloration: layers.CanvasColorationEffects.Any;

  /**
   * A layer which adds darkness effects to the scene.
   */
  darkness: layers.CanvasDarknessEffects.Any;

  /**
   * Clear all effects containers and animated sources.
   */
  clearEffects(): void;

  protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Initialize positive light sources which exist within the active Scene.
   * Packages can use the "initializeLightSources" hook to programmatically add light sources.
   */
  initializeLightSources(): void;

  /**
   * Initialize all sources that generate edges (Darkness and certain Light sources).
   * Darkness sources always generate edges. Light sources only do so if their priority is strictly greater than 0.
   * The `edgesSources` array will be rebuilt and sorted by descending priority, in the case of a tie,
   * DarknessSources take precedence. Otherwise, the existing array is used as-is.
   * Regardless of whether the array is rebuilt, each source is re-initialized to ensure their geometry is refreshed.
   */
  initializePriorityLightSources(): void;

  /**
   * Refresh the state and uniforms of all light sources and darkness sources objects.
   */
  refreshLightSources(): void;

  /**
   * Refresh the state and uniforms of all VisionSource objects.
   */
  refreshVisionSources(): void;

  /**
   * Refresh the active display of lighting.
   */
  refreshLighting(): void;

  /**
   * Test whether the point is inside light.
   * @param point   - The point to test.
   * @param options -
   * @returns Is inside light?
   */
  testInsideLight(point: Canvas.ElevatedPoint, options?: EffectsCanvasGroup.TestInsideLightOptions): boolean;

  /**
   * Test whether the point is inside light.
   * @param point     - The point.
   * @param elevation - The elevation of the point.
   * @returns Is inside light?
   * @deprecated "`EffectsCanvasGroup#testInsideLight(point: Point, elevation: number)` has been deprecated in favor of `EffectsCanvasGroup#testInsideLight(point: ElevatedPoint, options: object)`." (since v13, until v15)
   */
  testInsideLight(point: Canvas.Point, elevation: number): boolean;

  /**
   * Test whether the point is inside darkness.
   * @param point   - The point to test.
   * @param options -
   * @returns Is inside darkness?
   */
  testInsideDarkness(point: Canvas.ElevatedPoint, options?: EffectsCanvasGroup.TestInsideDarknessOptions): boolean;

  /**
   * Test whether the point is inside darkness.
   * @param point     - The point.
   * @param elevation - The elevation of the point.
   * @returns Is inside darkness?
   * @remarks Foundry does not use the `elevation` parameter
   * @deprecated "`EffectsCanvasGroup#testInsideDarkness(point: Point, elevation: number)` has been deprecated in favor of `EffectsCanvasGroup#testInsideDarkness(point: ElevatedPoint, options: object)`." (since v13, until v15)
   *
   */
  testInsideDarkness(point: Canvas.Point, _elevation: number): boolean;

  /**
   * Get the darkness level at the given point.
   * @param point - The point.
   * @returns The darkness level.
   */
  getDarknessLevel(point: Canvas.ElevatedPoint): number;

  /**
   * Get the darkness level at the given point.
   * @param point     - The point.
   * @param elevation - The elevation of the point.
   * @returns The darkness level.
   * @deprecated "`EffectsCanvasGroup#getDarknessLevel(point: Point, elevation: number)` has been deprecated in favor of `EffectsCanvasGroup#getDarknessLevel(point: ElevatedPoint)`." (since v13, until v15)
   */
  getDarknessLevel(point: Canvas.Point, _elevation: number): number;

  protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

  /**
   * Activate vision masking for visual effects
   * @param enabled - Whether to enable or disable vision masking (default: `true`)
   * @remarks Despite the name, this will not swap the existing state, just set it to the value of `enabled`.
   *
   * Ignores `enabled` and always sets `false` if {@linkcode Canvas.visibilityOptions.persistentVision | canvas.visibilityOptions.persistentVision} is truthy
   */
  toggleMaskingFilters(enabled?: boolean): void;

  /**
   * Activate post-processing effects for a certain effects channel.
   * @param filterMode          - The filter mode to target.
   * @param postProcessingModes - The post-processing modes to apply to this filter.
   * @param uniforms            - The uniforms to update.
   */
  activatePostProcessingFilters(
    filterMode: VisualEffectsMaskingFilter.FILTER_MODES,
    postProcessingModes?: VisualEffectsMaskingFilter.PostProcessModes,
    uniforms?: AbstractBaseShader.Uniforms,
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
  animateDarkness(target?: number, options?: EffectsCanvasGroup.AnimateDarknessOptions): CanvasAnimation.AnimateReturn;

  /**
   * @deprecated "`EffectsCanvasGroup#visibility` has been deprecated and moved to {@linkcode foundry.canvas.Canvas.visibility | Canvas#visibility}." (since v12, until v14)
   */
  get visibility(): CanvasVisibility.Implementation;

  /**
   * @deprecated "`EffectsCanvasGroup#globalLightSource` has been deprecated and moved to {@linkcode EnvironmentCanvasGroup.Implementation.globalLightSource | EnvironmentCanvasGroup#globalLightSource}." (since v12, until v14)
   */
  get globalLightSource(): EnvironmentCanvasGroup.Implementation["globalLightSource"];

  /**
   * @deprecated "`EffectsCanvasGroup#updateGlobalLightSource` has been deprecated and is part of {@linkcode EnvironmentCanvasGroup.Implementation.initialize | EnvironmentCanvasGroup#initialize} workflow." (since v12, until v14)
   */
  updateGlobalLightSource(): void;

  /**
   * @deprecated "`EffectsCanvasGroup#initializeDarknessSources` and its associated hook are now obsolete and have no replacement." (since v13, until v15)
   */
  initializeDarknessSources(): void;

  #EffectsCanvasGroup: true;
}

declare namespace EffectsCanvasGroup {
  interface Any extends AnyEffectsCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyEffectsCanvasGroup> {}

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.effects.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @internal */
  type _TestInsideLightOptions = InexactPartial<{
    /** Optional condition a source must satisfy in order to be tested. */
    // TODO: Make .InitializedImplementation
    condition: (source: sources.PointLightSource.Any | sources.GlobalLightSource.Any) => boolean;
  }>;

  interface TestInsideLightOptions extends _TestInsideLightOptions {}

  /** @internal */
  type _TestInsideDarknessOptions = InexactPartial<{
    /** Optional condition a source must satisfy in order to be tested. */
    // TODO: Make .InitializedImplementation
    condition: (source: sources.PointDarknessSource.Any) => boolean;
  }>;

  interface TestInsideDarknessOptions extends _TestInsideLightOptions {}

  /** @internal */
  type _AnimateDarknessOptions = InexactPartial<{
    /**
     * The desired animation time in milliseconds. Default is 10 seconds
     * @defaultValue `10000`
     */
    duration: number;
  }>;

  interface AnimateDarknessOptions extends _AnimateDarknessOptions {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}

  /**
   * @remarks {@linkcode EffectsCanvasGroup} overrides {@linkcode CanvasGroupMixin.AnyMixed._createLayers | #_createLayers},
   * returning a predefined object rather than something built from `CONFIG`. The layer classes are constructed by name,
   * with no ability to override or extend by users.
   * @privateRemarks ... which is why `.Any` is not used here
   */
  interface Layers {
    /** A layer of background alteration effects which change the appearance of the primary group render texture. */
    background: layers.CanvasBackgroundAlterationEffects;

    /** A layer which adds illumination-based effects to the scene. */
    illumination: layers.CanvasIlluminationEffects;

    /** A layer which adds color-based effects to the scene. */
    coloration: layers.CanvasColorationEffects;

    /** A layer which adds darkness effects to the scene. */
    darkness: layers.CanvasDarknessEffects;
  }
}

export default EffectsCanvasGroup;

declare abstract class AnyEffectsCanvasGroup extends EffectsCanvasGroup {
  constructor(...args: never);
}
