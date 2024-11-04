export {};

declare abstract class AnyRoilingDarknessShader extends RoilingDarknessShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace RoilingDarknessShader {
    type AnyConstructor = typeof AnyRoilingDarknessShader;
  }
  /**
   * Roiling mass illumination shader - intended primarily for darkness
   */
  class RoilingDarknessShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }
}
