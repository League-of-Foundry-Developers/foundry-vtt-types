import type { FixedInstanceType, Identity } from "#utils";
import type { AbstractBaseFilter, AbstractBaseMaskFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

declare class VisionMaskFilter extends AbstractBaseMaskFilter {
  static override fragmentShader: string;

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
   * @remarks This is set as a property all the way up in PIXI.Filter, however Foundry has it
   * as a getter, with a no-op setter. It's still like this in 13.345.
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
