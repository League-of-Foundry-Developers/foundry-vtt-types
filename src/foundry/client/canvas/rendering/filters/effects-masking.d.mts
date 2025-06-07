import type { AnyObject, Brand, FixedInstanceType, Identity, InexactPartial, ShapeWithIndexSignature } from "#utils";
import type { AbstractBaseFilter, AbstractBaseMaskFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * This filter handles masking and post-processing for visual effects.
 */
declare class VisualEffectsMaskingFilter extends AbstractBaseMaskFilter {
  /**
   * @remarks `postProcessModes` is pulled out of `options` and passed to {@link VisualEffectsMaskingFilter.fragmentShader | `this.fragmentShader`},
   * the rest of the object is treated as `initialUniforms` as per {@linkcode AbstractBaseFilter.create}
   */
  static override create<ThisType extends AbstractBaseFilter.AnyConstructor, T extends AnyObject>(
    this: ThisType,
    { postProcessModes, ...initialUniforms }?: VisualEffectsMaskingFilter.CreateOptions<T>,
  ): FixedInstanceType<ThisType>;

  /**
   * Masking modes.
   * @remarks Object is frozen
   */
  static FILTER_MODES: VisualEffectsMaskingFilter.FilterModes;

  /**
   * @defaultValue
   * ```js
   * {
   *    tint: [1, 1, 1],
   *    screenDimensions: [1, 1],
   *    enableVisionMasking: true,
   *    visionTexture: null,
   *    darknessLevelTexture: null,
   *    exposure: 0,
   *    contrast: 0,
   *    saturation: 0,
   *    mode: 0,
   *    ambientDarkness: [0, 0, 0],
   *    ambientDaylight: [1, 1, 1],
   *    replacementColor: [0, 0, 0]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Update the filter shader with new post-process modes.
   * @param postProcessModes - New modes to apply.
   * @param uniforms         - Uniforms value to update.
   */
  updatePostprocessModes(
    postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes,
    uniforms?: AbstractBaseShader.Uniforms,
  ): void;

  /**
   * Remove all post-processing modes and reset some key uniforms.
   */
  reset(): void;

  override apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear: PIXI.CLEAR_MODES,
    currentState?: PIXI.FilterState,
  ): void;

  /**
   * Filter post-process techniques.
   */
  static POST_PROCESS_TECHNIQUES: VisualEffectsMaskingFilter.PostProcessTechniques;

  /**
   * Memory allocations and headers for the VisualEffectsMaskingFilter
   */
  static fragmentHeader: string;

  static fragmentCore: string;

  /**
   * Construct filter post-processing code according to provided value.
   * @param postProcessModes - Post-process modes to construct techniques.
   * @returns The constructed shader code for post-process techniques.
   */
  static fragmentPostProcess(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;

  /**
   * Specify the fragment shader to use according to mode
   * @param postProcessModes - (default: `[]`)
   */
  static override fragmentShader(postProcessModes?: VisualEffectsMaskingFilter.PostProcessModes): string;
}

declare namespace VisualEffectsMaskingFilter {
  interface Any extends AnyVisualEffectsMaskingFilter {}
  interface AnyConstructor extends Identity<typeof AnyVisualEffectsMaskingFilter> {}

  // TODO: This can't be an interface yet because of 'An interface can only extend an object type or intersection of object types with statically known members' errors
  type ImplementationClass = CONFIG["Canvas"]["visualEffectsMaskingFilter"];
  interface ImplementationInstance extends FixedInstanceType<ImplementationClass> {}

  type PostProcessModes = Array<keyof typeof VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES>;

  /** @internal */
  type _ConcreteCreateOptions = InexactPartial<{
    /**
     * @defaultValue `[]`
     * @privateRemarks Default not in construction signature, but provided by {@linkcode VisualEffectsMaskingFilter.fragmentShader}
     */
    postProcessModes: PostProcessModes;
  }>;

  interface ConcreteCreateOptions extends _ConcreteCreateOptions {}
  type CreateOptions<T extends AnyObject> = ShapeWithIndexSignature<
    T,
    VisualEffectsMaskingFilter.ConcreteCreateOptions,
    string,
    AbstractBaseShader.UniformValue
  >;

  type FILTER_MODES = Brand<number, "VisualEffectsMaskingFilter.FILTER_MODES">;

  interface FilterModes {
    readonly BACKGROUND: 0 & FILTER_MODES;
    readonly ILLUMINATION: 1 & FILTER_MODES;
    readonly COLORATION: 2 & FILTER_MODES;
  }

  type POST_PROCESS_TECHNIQUES_ID = Brand<string, "VisualEffectsMaskingFilter.POST_PROCESS_TECHNIQUES.ID">;

  interface PostProcessTechniques {
    EXPOSURE: { id: "EXPOSURE" & POST_PROCESS_TECHNIQUES_ID; glsl: string };
    CONTRAST: { id: "CONTRAST" & POST_PROCESS_TECHNIQUES_ID; glsl: string };
    SATURATION: { id: "SATURATION" & POST_PROCESS_TECHNIQUES_ID; glsl: string };
  }
}

export default VisualEffectsMaskingFilter;

declare abstract class AnyVisualEffectsMaskingFilter extends VisualEffectsMaskingFilter {
  constructor(...args: never);
}
