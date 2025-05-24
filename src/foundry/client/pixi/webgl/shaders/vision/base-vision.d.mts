import type { Identity } from "#utils";

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
    interface Any extends AnyAdaptiveVisionShader {}
    interface AnyConstructor extends Identity<typeof AnyAdaptiveVisionShader> {}
  }
}

declare abstract class AnyAdaptiveVisionShader extends AdaptiveVisionShader {
  constructor(...args: never);
}
