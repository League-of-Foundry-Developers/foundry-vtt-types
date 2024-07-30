export {};

declare global {
  /**
   * Alternative torch illumination shader
   */
  class FlameIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, brightnessPulse: 1}
     * ```
     */
    static overridedefaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Alternative torch coloration shader
   */
  class FlameColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * { ...super.defaultUniforms, brightnessPulse: 1}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
