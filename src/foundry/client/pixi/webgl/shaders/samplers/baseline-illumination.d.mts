export {};

declare global {
  /**
   * Compute baseline illumination according to darkness level encoded texture.
   */
  class BaselineIlluminationSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
