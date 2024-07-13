export {};

declare global {
  /**
   * Roiling mass illumination shader - intended primarily for darkness
   */
  class RoilingDarknessShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
