export {};

declare abstract class AnyVisionMaskFilter extends VisionMaskFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace VisionMaskFilter {
    type AnyConstructor = typeof AnyVisionMaskFilter;
  }

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
    ): InstanceType<ThisType>;

    /**
     * @remarks This is set as a property all the way up in PIXI.Filter, however Foundry has it
     * as a getter, with a no-op setter. 12.330 did not change this signature after reporting its
     * oddity, so it appears we're stuck with this.
     */
    override readonly enabled: boolean;
  }
}
