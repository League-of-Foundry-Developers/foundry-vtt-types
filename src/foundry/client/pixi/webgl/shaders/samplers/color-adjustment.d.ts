export {};

declare global {
  /**
   * A color adjustment shader.
   */
  class ColorAdjustmentsSamplerShader extends BaseSamplerShader {}

  /**
   * A light amplification shader.
   */
  class AmplificationSamplerShader extends ColorAdjustmentsSamplerShader {}
}
