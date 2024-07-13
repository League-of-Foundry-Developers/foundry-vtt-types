export {};

declare global {
  /**
   * Shader specialized in light amplification
   */
  class AmplificationBackgroundVisionShader extends BackgroundVisionShader {
    static override fragmentShader: string | ((...args: any[]) => string);

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, colorTint: [0.38, 0.8, 0.38], brightness: 0.5}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }
}
