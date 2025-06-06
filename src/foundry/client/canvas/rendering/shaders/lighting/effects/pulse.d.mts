import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";
import type AbstractBaseShader from "../../base-shader.mjs";

/**
 * Pulse animation illumination shader
 */
declare class PulseIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace PulseIlluminationShader {
  interface Any extends AnyPulseIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyPulseIlluminationShader> {}
}

/**
 * Pulse animation coloration shader
 */
declare class PulseColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   pulse: 0
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace PulseColorationShader {
  interface Any extends AnyPulseColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyPulseColorationShader> {}
}

export { PulseColorationShader, PulseIlluminationShader };

declare abstract class AnyPulseColorationShader extends PulseColorationShader {
  constructor(...args: never);
}

declare abstract class AnyPulseIlluminationShader extends PulseIlluminationShader {
  constructor(...args: never);
}
