export {};

declare global {
  /**
   * The default background shader used for vision sources
   */
  class BackgroundVisionShader extends AdaptiveVisionShader {
    static override FRAGMENT_END: string;

    /**
     * Adjust the intensity according to the difference between the pixel darkness level and the scene darkness level.
     * Used to see the difference of intensity when computing the background shader which is completeley overlapping
     * The surface texture.
     */
    static ADJUST_INTENSITY: string;

    static override ADJUSTMENTS: string;

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

  namespace BackgroundVisionShader {
    interface Any extends AnyBackgroundVisionShader {}
    type AnyConstructor = typeof AnyBackgroundVisionShader;
  }
}

declare abstract class AnyBackgroundVisionShader extends BackgroundVisionShader {
  constructor(arg0: never, ...args: never[]);
}
