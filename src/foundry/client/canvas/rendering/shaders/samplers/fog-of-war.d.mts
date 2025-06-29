import type { Identity } from "#utils";
import type { BaseSamplerShader } from "../_module.mjs";

/**
 * A simple shader that makes the original texture's red channel the alpha channel while still keeping channel
 * information. Used in conjunction with the {@linkcode foundry.canvas.rendering.filters.AlphaBlurFilterPass}
 * and Fog of War.
 */
declare class FogSamplerShader extends BaseSamplerShader {
  /**
   * @defaultValue `null`
   */
  static override classPluginName: string | null;

  static override fragmentShader: string;
}

declare namespace FogSamplerShader {
  interface Any extends AnyFogSamplerShader {}
  interface AnyConstructor extends Identity<typeof AnyFogSamplerShader> {}
}

export default FogSamplerShader;

declare abstract class AnyFogSamplerShader extends FogSamplerShader {
  constructor(...args: never);
}
