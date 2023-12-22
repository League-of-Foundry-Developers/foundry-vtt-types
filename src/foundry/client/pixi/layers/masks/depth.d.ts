export {};

declare global {
  /**
   * The depth mask which contains a mapping of elevation. Needed to know if we must render objects according to depth.
   */
  class CanvasDepthMask extends CachedContainer {}
}
