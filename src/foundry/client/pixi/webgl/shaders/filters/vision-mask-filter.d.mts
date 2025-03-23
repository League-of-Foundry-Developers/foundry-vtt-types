import type { FixedInstanceType, Identity } from "fvtt-types/utils";

declare global {
  class VisionMaskFilter extends AbstractBaseMaskFilter {
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
     * as a getter, with a no-op setter. It's still like this in 13.332.
     */
    override readonly enabled: boolean;
  }

  namespace VisionMaskFilter {
    interface Any extends AnyVisionMaskFilter {}
    interface AnyConstructor extends Identity<typeof AnyVisionMaskFilter> {}
  }
}

declare abstract class AnyVisionMaskFilter extends VisionMaskFilter {
  constructor(...args: never);
}
