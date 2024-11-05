export {};

declare abstract class AnyMagicalGloomDarknessShader extends MagicalGloomDarknessShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace MagicalGloomDarknessShader {
    type AnyConstructor = typeof AnyMagicalGloomDarknessShader;
  }

  /**
   * Creates a gloomy ring of pure darkness.
   */
  class MagicalGloomDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string;
  }
}
