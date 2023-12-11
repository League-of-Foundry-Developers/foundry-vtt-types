export {};

declare global {
  /**
   * An occlusion shader to reveal certain area with elevation comparisons.
   * This shader is also working as a batched plugin.
   */
  class OcclusionSamplerShader extends BaseSamplerShader {}
}
