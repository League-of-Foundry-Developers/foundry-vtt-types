export {};

declare global {
  /**
   * The default coloration shader used by standard rendering and animations
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveIlluminationShader extends AdaptiveLightingShader {
    static override FRAGMENT_BEGIN: string;

    static override FRAGMENT_END: string;

    /**
     * The adjustments made into fragment shaders
     */
    static get ADJUSTMENTS(): string;

    static override EXPOSURE: string;

    /**
     * Memory allocations for the Adaptive Illumination Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string | ((...args: any[]) => string);

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the illumination shader is currently required.
     */
    get isRequired(): boolean;
  }
}
