export {};

declare global {
  /**
   * A color adjustment shader.
   */
  class ColorAdjustmentsSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    get linkedToDarknessLevel(): AbstractBaseShader.UniformValue;

    set linkedToDarknessLevel(link);

    get darknessLevel(): AbstractBaseShader.UniformValue;

    set darknessLevel(darknessLevel);

    get contrast(): AbstractBaseShader.UniformValue;

    set contrast(contrast);

    get exposure(): AbstractBaseShader.UniformValue;

    set exposure(exposure);

    get saturation(): AbstractBaseShader.UniformValue;

    set saturation(saturation);
  }

  /**
   * A light amplification shader.
   */
  class AmplificationSamplerShader extends ColorAdjustmentsSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override vertexShader: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Brightness controls the luminosity.
     */
    get brightness(): number;

    set brightness(brightness);

    /**
     * Tint color applied to Light Amplification.
     * Light Amplification tint
     * @defaultValue `[0.48, 1.0, 0.48]`
     */
    get colorTint(): number[];

    set colorTint(color);
  }
}
