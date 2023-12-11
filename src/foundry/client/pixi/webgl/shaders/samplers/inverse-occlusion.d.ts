export {};

declare global {
  /**
   * A shader used to control channels intensity using an externally provided mask texture.
   */
  class InverseOcclusionSamplerShader extends BaseSamplerShader {}
}
