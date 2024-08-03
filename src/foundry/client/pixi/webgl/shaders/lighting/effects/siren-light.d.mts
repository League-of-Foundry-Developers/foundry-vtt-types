export {};

declare global {
  /**
   * Siren light animation coloration shader
   */
  class SirenColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   ratio: 0,
     *   brightnessPulse: 1,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Siren light animation illumination shader
   */
  class SirenIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.45,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
