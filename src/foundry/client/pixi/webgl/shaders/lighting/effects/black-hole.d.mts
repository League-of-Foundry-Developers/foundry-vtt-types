export {};

declare global {
  /**
   * Black Hole animation illumination shader
   */
  class BlackHoleDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string;
  }

  namespace BlackHoleDarknessShader {
    type Any = AnyBlackHoleDarknessShader;
    type AnyConstructor = typeof AnyBlackHoleDarknessShader;
  }
}

declare abstract class AnyBlackHoleDarknessShader extends BlackHoleDarknessShader {
  constructor(arg0: never, ...args: never[]);
}
