import type { Identity } from "#utils";
import type { AbstractBaseShader, BackgroundVisionShader, ColorationVisionShader } from "../../_module.mjs";

/**
 * Shader specialized in wave like senses (tremorsenses)
 */
declare class WaveBackgroundVisionShader extends BackgroundVisionShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   colorTint: [0.8, 0.1, 0.8]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  override get isRequired(): boolean;
}

declare namespace WaveBackgroundVisionShader {
  interface Any extends AnyWaveBackgroundVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyWaveBackgroundVisionShader> {}
}

/**
 * The wave vision shader, used to create waves emanations (ex: tremorsense)
 */
declare class WaveColorationVisionShader extends ColorationVisionShader {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   colorEffect: [0.8, 0.1, 0.8]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  override get isRequired(): boolean;
}

declare namespace WaveColorationVisionShader {
  interface Any extends AnyWaveColorationVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyWaveColorationVisionShader> {}
}

export { WaveBackgroundVisionShader, WaveColorationVisionShader };

declare abstract class AnyWaveBackgroundVisionShader extends WaveBackgroundVisionShader {
  constructor(...args: never);
}

declare abstract class AnyWaveColorationVisionShader extends WaveColorationVisionShader {
  constructor(...args: never);
}
