export {};

declare global {
  /**
   * A simple shader which purpose is to make the original texture red channel the alpha channel,
   * and still keeping channel informations. Used in cunjunction with the AlphaBlurFilterPass and Fog of War.
   */
  class FogSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    static override fragmentShader: string;
  }
}
