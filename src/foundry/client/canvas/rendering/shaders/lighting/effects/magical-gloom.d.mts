import type { Identity } from "#utils";
import type AdaptiveDarknessShader from "../darkness-lighting.mjs";

/**
 * Creates a gloomy ring of pure darkness.
 */
declare class MagicalGloomDarknessShader extends AdaptiveDarknessShader {
  static override fragmentShader: string;
}

declare namespace MagicalGloomDarknessShader {
  interface Any extends AnyMagicalGloomDarknessShader {}
  interface AnyConstructor extends Identity<typeof AnyMagicalGloomDarknessShader> {}
}

export { MagicalGloomDarknessShader };

declare abstract class AnyMagicalGloomDarknessShader extends MagicalGloomDarknessShader {
  constructor(...args: never);
}
