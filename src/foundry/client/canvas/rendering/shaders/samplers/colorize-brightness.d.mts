import type { Identity } from "#utils";
import type { AbstractBaseShader, BaseSamplerShader } from "../_module.mjs";

declare class ColorizeBrightnessShader extends BaseSamplerShader {
  /** @defaultValue `null` */
  static override classPluginName: string | null;

  static override vertexShader: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   tintAlpha: [1, 1, 1, 1],
   *   tintLinear: [1, 1, 1],
   *   sampler: null,
   *   screenDimensions: [1, 1],
   *   grey: true,
   *   intensity: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace ColorizeBrightnessShader {
  interface Any extends AnyColorizeBrightnessShader {}
  interface AnyConstructor extends Identity<typeof AnyColorizeBrightnessShader> {}
}

export default ColorizeBrightnessShader;

declare abstract class AnyColorizeBrightnessShader extends ColorizeBrightnessShader {
  constructor(...args: never);
}
