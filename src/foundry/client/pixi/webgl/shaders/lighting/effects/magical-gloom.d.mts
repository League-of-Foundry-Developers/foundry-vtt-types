export {};

declare global {
  /**
   * Creates a gloomy ring of pure darkness.
   */
  class MagicalGloomDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string;
  }

  namespace MagicalGloomDarknessShader {
    interface Any extends AnyMagicalGloomDarknessShader {}
    type AnyConstructor = typeof AnyMagicalGloomDarknessShader;
  }
}

declare abstract class AnyMagicalGloomDarknessShader extends MagicalGloomDarknessShader {
  constructor(arg0: never, ...args: never[]);
}
