export {};

declare global {
  /**
   * A filter used to apply color adjustments and other modifications to the environment.
   */
  class PrimaryCanvasGroupAmbienceFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
