export {};

declare global {
  class VisionMaskFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: string | ((...args: any[]) => string) | undefined;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create(): AbstractBaseMaskFilter;

    /**
     * @remarks This is set as a property all the way up in PIXI.Filter and is listed as a getter, with a no-op setter
     * TODO: check back in after 12.329 to see if fixed
     */
    override readonly enabled: boolean;
  }
}
