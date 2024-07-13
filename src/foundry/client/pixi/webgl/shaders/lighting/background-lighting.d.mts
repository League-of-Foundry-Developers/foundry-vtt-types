export {};

declare global {
  /**
   * The default coloration shader used by standard rendering and animations
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveBackgroundShader extends AdaptiveLightingShader {
    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string | ((...args: any[]) => string);

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the background shader is currently required.
     * Check vision modes requirements first, then
     * if key uniforms are at their default values, we don't need to render the background container.
     */
    get isRequired(): boolean;
  }
}
