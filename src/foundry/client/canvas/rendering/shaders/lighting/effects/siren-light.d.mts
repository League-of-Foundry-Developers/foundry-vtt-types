import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";
import type AbstractBaseShader from "../../base-shader.mjs";

/**
 * Siren light animation coloration shader
 */
declare class SirenColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   ratio: 0,
   *   brightnessPulse: 1,
   *   angle: 0,
   *   gradientFade: 0.15,
   *   beamLength: 1
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace SirenColorationShader {
  interface Any extends AnySirenColorationShader {}
  interface AnyConstructor extends Identity<typeof AnySirenColorationShader> {}
}

/**
 * Siren light animation illumination shader
 */
declare class SirenIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   angle: 0,
   *   gradientFade: 0.45,
   *   beamLength: 1
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace SirenIlluminationShader {
  interface Any extends AnySirenIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnySirenIlluminationShader> {}
}

export { SirenColorationShader, SirenIlluminationShader };

declare abstract class AnySirenColorationShader extends SirenColorationShader {
  constructor(...args: never);
}

declare abstract class AnySirenIlluminationShader extends SirenIlluminationShader {
  constructor(...args: never);
}
