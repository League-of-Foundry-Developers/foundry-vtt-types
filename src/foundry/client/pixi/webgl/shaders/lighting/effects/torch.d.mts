export {};

declare global {
  /**
   * Allow coloring of illumination
   */
  class TorchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Torch animation coloration shader
   */
  class TorchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);

    /**
     * @defaultValue
     * ```javascript
     * {...super.defaultUniforms, ratio: 0, brightnessPulse: 1}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
