import type { FixedInstanceType, Identity } from "#utils";
import type { AbstractBaseFilter, AbstractBaseMaskFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

declare class VisionMaskFilter extends AbstractBaseMaskFilter {
  protected static override _createFragmentShader(): string;

  /**
   * @defaultValue
   * ```js
   * {
   *   uMaskSampler: null
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
    this: ThisType,
  ): FixedInstanceType<ThisType>;

  /**
   * Is this filter currently suppressed?
   * @defaultValue `false`
   */
  suppressed: boolean;

  /**
   * This filter is enabled if and only if it is not suppressed and `canvas.visibility.visible` is true.
   * This property cannot be set. Set {@link VisionMaskFilter#suppressed} to disable this filter.
   */
  override readonly enabled: boolean;
}

declare namespace VisionMaskFilter {
  interface Any extends AnyVisionMaskFilter {}
  interface AnyConstructor extends Identity<typeof AnyVisionMaskFilter> {}
}

export default VisionMaskFilter;

declare abstract class AnyVisionMaskFilter extends VisionMaskFilter {
  constructor(...args: never);
}
