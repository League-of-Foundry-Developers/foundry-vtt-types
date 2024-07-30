export {};

declare global {
  class VisionMaskFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create(): AbstractBaseMaskFilter;

    /**
     * @remarks This is set as a property all the way up in PIXI.Filter, however Foundry has it
     * as a getter, with a no-op setter. 12.330 did not change this signature after reporting its
     * oddity, so it appears we're stuck with this.
     */
    override readonly enabled: boolean;
  }
}
