import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default coloration shader used for vision sources.
 */
declare class ColorationVisionShader extends AdaptiveVisionShader {
  /**
   * @defaultValue `""`
   */
  static override EXPOSURE: string;

  /**
   * @defaultValue `""`
   */
  static override CONTRAST: string;

  /**
   * Memory allocations for the Adaptive Coloration Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  static override defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Flag whether the coloration shader is currently required.
   * If key uniforms are at their default values, we don't need to render the coloration container.
   */
  get isRequired(): boolean;
}

declare namespace ColorationVisionShader {
  interface Any extends AnyColorationVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyColorationVisionShader> {}
}

export default ColorationVisionShader;

declare abstract class AnyColorationVisionShader extends ColorationVisionShader {
  constructor(...args: never);
}
