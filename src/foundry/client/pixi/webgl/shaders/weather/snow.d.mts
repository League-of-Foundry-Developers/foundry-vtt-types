export {};

declare global {
  /**
   * Snow shader effect.
   */
  class SnowShader extends AbstractWeatherShader {
    /**
     * @defaultValue
     * ```
     * {
     *  direction: 1.2
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
