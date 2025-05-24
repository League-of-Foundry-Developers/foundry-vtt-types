import type { Identity } from "#utils";

declare global {
  /**
   * Creates a gloomy ring of pure darkness.
   */
  class MagicalGloomDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string;
  }

  namespace MagicalGloomDarknessShader {
    interface Any extends AnyMagicalGloomDarknessShader {}
    interface AnyConstructor extends Identity<typeof AnyMagicalGloomDarknessShader> {}
  }
}

declare abstract class AnyMagicalGloomDarknessShader extends MagicalGloomDarknessShader {
  constructor(...args: never);
}
