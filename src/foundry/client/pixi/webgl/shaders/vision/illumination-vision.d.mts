export {};

declare abstract class AnyIlluminationVisionShader extends IlluminationVisionShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace IlluminationVisionShader {
    type AnyConstructor = typeof AnyIlluminationVisionShader;
  }

  /**
   * The default illumination shader used for vision sources
   */
  class IlluminationVisionShader extends AdaptiveVisionShader {
    static override FRAGMENT_BEGIN: string;

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
}
