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
     * @remarks Removes all parent techniques other than `LEGACY`
     */
    static override SHADER_TECHNIQUES: Record<string, AdaptiveLightingShader.ShaderTechnique>;
  }

  namespace AdaptiveVisionShader {
    type Any = AnyAdaptiveVisionShader;
    type AnyConstructor = typeof AnyAdaptiveVisionShader;
  }
}

declare abstract class AnyAdaptiveVisionShader extends AdaptiveVisionShader {
  constructor(arg0: never, ...args: never[]);
}
