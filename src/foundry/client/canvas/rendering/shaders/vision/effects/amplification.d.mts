import type { Identity } from "#utils";
import type { AbstractBaseShader, BackgroundVisionShader } from "../../_module.mjs";

/**
 * Shader specialized in light amplification
 */
declare class AmplificationBackgroundVisionShader extends BackgroundVisionShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   colorTint: [0.38, 0.8, 0.38],
   *   brightness: 0.5
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  override get isRequired(): boolean;
}

declare namespace AmplificationBackgroundVisionShader {
  interface Any extends AnyAmplificationBackgroundVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyAmplificationBackgroundVisionShader> {}
}

export { AmplificationBackgroundVisionShader };

declare abstract class AnyAmplificationBackgroundVisionShader extends AmplificationBackgroundVisionShader {
  constructor(...args: never);
}
