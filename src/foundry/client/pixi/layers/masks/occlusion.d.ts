export {};

declare global {
  /**
   * The occlusion mask which contains radial occlusion and vision occlusion from tokens.
   */
  class CanvasOcclusionMask extends CachedContainer {}
}
