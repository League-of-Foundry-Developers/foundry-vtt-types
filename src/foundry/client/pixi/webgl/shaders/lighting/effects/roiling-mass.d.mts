import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Roiling mass illumination shader - intended primarily for darkness
   */
  class RoilingDarknessShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace RoilingDarknessShader {
    interface Any extends AnyRoilingDarknessShader {}
    interface AnyConstructor extends Identity<typeof AnyRoilingDarknessShader> {}
  }
}

declare abstract class AnyRoilingDarknessShader extends RoilingDarknessShader {
  constructor(...args: never);
}
