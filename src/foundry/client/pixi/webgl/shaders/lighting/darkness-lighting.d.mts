export {};

declare global {
  /**
   * The default coloration shader used by standard rendering and animations.
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveDarknessShader extends AdaptiveLightingShader {
    override update(): void;

    /**
     * Flag whether the darkness shader is currently required.
     * Check vision modes requirements first, then
     * if key uniforms are at their default values, we don't need to render the background container.
     */
    get isRequired(): boolean;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * Initialize fragment with common properties
     */
    static FRAGMENT_BEGIN: string;

    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
