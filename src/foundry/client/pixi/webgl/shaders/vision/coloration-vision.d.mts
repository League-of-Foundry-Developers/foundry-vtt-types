export {};

declare global {
  /**
   * The default coloration shader used for vision sources.
   */
  class ColorationVisionShader extends AdaptiveVisionShader {
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

  namespace ColorationVisionShader {
    interface Any extends AnyColorationVisionShader {}
    type AnyConstructor = typeof AnyColorationVisionShader;
  }
}

declare abstract class AnyColorationVisionShader extends ColorationVisionShader {
  constructor(arg0: never, ...args: never[]);
}
