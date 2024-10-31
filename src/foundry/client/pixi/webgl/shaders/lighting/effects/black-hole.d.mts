export {};

declare abstract class AnyBlackHoleDarknessShader extends BlackHoleDarknessShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace BlackHoleDarknessShader {
    type AnyConstructor = typeof AnyBlackHoleDarknessShader;
  }

  /**
   * Black Hole animation illumination shader
   */
  class BlackHoleDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
