import type { Identity } from "#utils";
import type { AdaptiveLightingShader } from "../_module.mjs";

/**
 * This class defines an interface which all adaptive vision shaders extend.
 */
declare class AdaptiveVisionShader extends AdaptiveLightingShader {
  static override FRAGMENT_FUNCTIONS: string;

  static override EXPOSURE: string;

  static override COMPUTE_ILLUMINATION: string;

  static override FRAGMENT_BEGIN: string;

  /** @defaultValue `""` */
  static override SHADOW: string;

  /**
   * A mapping of available shader techniques
   * @remarks Removes all parent techniques other than `LEGACY`
   */
  static override SHADER_TECHNIQUES: Record<string, AdaptiveLightingShader.ShaderTechnique>;
}

declare namespace AdaptiveVisionShader {
  interface Any extends AnyAdaptiveVisionShader {}
  interface AnyConstructor extends Identity<typeof AnyAdaptiveVisionShader> {}
}

export default AdaptiveVisionShader;

declare abstract class AnyAdaptiveVisionShader extends AdaptiveVisionShader {
  constructor(...args: never);
}
