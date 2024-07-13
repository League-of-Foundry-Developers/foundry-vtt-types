export {};

declare global {
  /**
   * A filter used to apply color adjustments and other modifications to the environment.
   */
  class PrimaryCanvasGroupAmbienceFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: string | ((...args: any[]) => string) | undefined;
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
