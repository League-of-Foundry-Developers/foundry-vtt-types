export {};

declare global {
  /**
   * Roiling mass illumination shader - intended primarily for darkness
   */
  class RoilingDarknessShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace RoilingDarknessShader {
    interface Any extends AnyRoilingDarknessShader {}
    type AnyConstructor = typeof AnyRoilingDarknessShader;
  }
}

declare abstract class AnyRoilingDarknessShader extends RoilingDarknessShader {
  constructor(arg0: never, ...args: never[]);
}
