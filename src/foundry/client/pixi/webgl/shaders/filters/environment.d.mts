export {};

declare global {
  /**
   * A filter used to apply color adjustments and other modifications to the environment.
   */
  class PrimaryCanvasGroupAmbienceFilter extends AbstractBaseMaskFilter {
    static fragmentShader: string;
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
