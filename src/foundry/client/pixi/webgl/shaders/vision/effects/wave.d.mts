export {};

declare global {
  /**
   * Shader specialized in wave like senses (tremorsenses)
   */
  class WaveBackgroundVisionShader extends BackgroundVisionShader {
    static override fragmentShader: string | ((...args: any[]) => string);

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, colorTint: [0.8, 0.1, 0.8]}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }

  /**
   * The wave vision shader, used to create waves emanations (ex: tremorsense)
   */
  class WaveColorationVisionShader extends ColorationVisionShader {
    static override fragmentShader: string | ((...args: any[]) => string);

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }
}
