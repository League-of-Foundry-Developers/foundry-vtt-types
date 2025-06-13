import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";
import type AbstractBaseShader from "../../base-shader.mjs";

/**
 * Alternative torch illumination shader
 */
declare class FlameIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   brightnessPulse: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace FlameIlluminationShader {
  interface Any extends AnyFlameIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyFlameIlluminationShader> {}
}

/**
 * Alternative torch coloration shader
 */
declare class FlameColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   brightnessPulse: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace FlameColorationShader {
  interface Any extends AnyFlameColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyFlameColorationShader> {}
}

export { FlameColorationShader, FlameIlluminationShader };

declare abstract class AnyFlameIlluminationShader extends FlameIlluminationShader {
  constructor(...args: never);
}

declare abstract class AnyFlameColorationShader extends FlameColorationShader {
  constructor(...args: never);
}
