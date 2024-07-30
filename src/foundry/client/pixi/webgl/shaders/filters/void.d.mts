export {};

declare global {
  /**
   * A minimalist filter (just used for blending)
   */
  class VoidFilter extends AbstractBaseFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;
  }
}
