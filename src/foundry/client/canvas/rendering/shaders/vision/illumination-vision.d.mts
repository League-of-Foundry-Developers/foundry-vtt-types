import type { Identity } from "#utils";
import type { AbstractBaseShader, AdaptiveVisionShader } from "../_module.mjs";

/**
 * The default illumination shader used for vision sources
 */
declare class IlluminationVisionShader extends AdaptiveVisionShader {
  static override FRAGMENT_END: string;

  /**
   * Transition between bright and dim colors, if requested
   */
  static VISION_COLOR: string;

  static get ADJUSTMENTS(): string;

  /**
   * Memory allocations for the Adaptive Illumination Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace IlluminationVisionShader {
  interface Any extends AnyIlluminationVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyIlluminationVisionShader> {}
}

export default IlluminationVisionShader;

declare abstract class AnyIlluminationVisionShader extends IlluminationVisionShader {
  constructor(...args: never);
}
