export {};

declare global {
  /**
   * Revolving animation coloration shader
   */
  class RevolvingColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
