import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default background shader used for vision sources
 */
declare class BackgroundVisionShader extends AdaptiveVisionShader {
  static override FRAGMENT_END: string;

  /**
   * Memory allocations for the Adaptive Background Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  static override defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Flag whether the background shader is currently required.
   * If key uniforms are at their default values, we don't need to render the background container.
   */
  get isRequired(): boolean;
}

declare namespace BackgroundVisionShader {
  interface Any extends AnyBackgroundVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyBackgroundVisionShader> {}
}

export default BackgroundVisionShader;

declare abstract class AnyBackgroundVisionShader extends BackgroundVisionShader {
  constructor(...args: never);
}
