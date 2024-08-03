export {};

declare global {
  /**
   * The default coloration shader used by standard rendering and animations.
   * A fragment shader which creates a light source.
   */
  class AdaptiveColorationShader extends AdaptiveLightingShader {
    static override FRAGMENT_END: string;

    /**
     * The adjustments made into fragment shaders
     */
    static override get ADJUSTMENTS(): string;

    static override SHADOW: string;

    /**
     * Memory allocations for the Adaptive Coloration Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the coloration shader is currently required.
     */
    get isRequired(): boolean;
  }
}
