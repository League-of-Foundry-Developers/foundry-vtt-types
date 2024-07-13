export {};

declare global {
  /**
   * Invisibility effect filter for placeables.
   */
  class InvisibilityFilter extends AbstractBaseFilter {
    static override fragmentShader: string | ((...args: any[]) => string) | undefined;
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
