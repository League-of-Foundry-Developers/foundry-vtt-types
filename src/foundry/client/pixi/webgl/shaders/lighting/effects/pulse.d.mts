export {};

declare global {
  /**
   * Pulse animation illumination shader
   */
  class PulseIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Pulse animation coloration shader
   */
  class PulseColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);

    /**
     * @defaultValue
     * ```javascript
     * {...super.defaultUniforms, pulse: 0}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
