import type { Identity } from "#utils";

declare global {
  /**
   * Black Hole animation illumination shader
   */
  class BlackHoleDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string;
  }

  namespace BlackHoleDarknessShader {
    interface Any extends AnyBlackHoleDarknessShader {}
    interface AnyConstructor extends Identity<typeof AnyBlackHoleDarknessShader> {}
  }
}

declare abstract class AnyBlackHoleDarknessShader extends BlackHoleDarknessShader {
  constructor(...args: never);
}
