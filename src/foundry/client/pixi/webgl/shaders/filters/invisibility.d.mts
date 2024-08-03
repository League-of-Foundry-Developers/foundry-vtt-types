export {};

declare global {
  /**
   * Invisibility effect filter for placeables.
   */
  class InvisibilityFilter extends AbstractBaseFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
