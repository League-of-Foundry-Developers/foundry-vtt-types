export {};

declare global {
  /**
   * Invisibility effect filter for placeables.
   */
  class InvisibilityFilter extends AbstractBaseFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   uSampler: null,
     *   color: [0.5, 1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
