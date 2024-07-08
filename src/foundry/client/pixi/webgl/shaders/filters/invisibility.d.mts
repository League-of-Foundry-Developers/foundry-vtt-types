export {};

declare global {
  /**
   * Invisibility effect filter for placeables.
   */
  class InvisibilityFilter extends AbstractBaseFilter {
    static fragmentShader: string;
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
