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

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    tintAlpha: [1, 1, 1, 1],
     *    tint: [1, 1, 1],
     *    contrast: 0,
     *    saturation: 0,
     *    exposure: 0,
     *    sampler: null,
     *    linkedToDarknessLevel: false,
     *    darknessLevel: 1
     * }
     * ```
     */
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

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    tintAlpha: [1, 1, 1, 1],
     *    tint: [0.38, 0.8, 0.38],
     *    brightness: 0,
     *    darknessLevel: 1,
     *    enable: true
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Level of natural brightness (opposed to darkness level).
     */
    get darknessLevel(): number;

    set darknessLevel(darknessLevel);

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
