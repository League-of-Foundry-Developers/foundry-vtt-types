export {};

declare global {
  /**
   * This class defines an interface which all adaptive vision shaders extend.
   */
  class AdaptiveVisionShader extends AdaptiveLightingShader {
    static override FRAGMENT_FUNCTIONS: string;

    static override EXPOSURE: string;

    static override COMPUTE_ILLUMINATION: string;

    static override SHADOW: string;

    static override FRAGMENT_BEGIN: string;

    /**
     * A mapping of available shader techniques
     */
    static override SHADER_TECHNIQUES: AdaptiveLightingShader.ShaderTechniques;
  }
}
