import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AbstractBaseShader from "../../base-shader.mjs";

/**
 * Revolving animation coloration shader
 */
declare class RevolvingColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   angle: 0,
   *   gradientFade: 0.15,
   *   beamLength: 1
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace RevolvingColorationShader {
  interface Any extends AnyRevolvingColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyRevolvingColorationShader> {}
}

export { RevolvingColorationShader };

declare abstract class AnyRevolvingColorationShader extends RevolvingColorationShader {
  constructor(...args: never);
}
