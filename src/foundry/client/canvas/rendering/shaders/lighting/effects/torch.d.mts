import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";
import type AbstractBaseShader from "../../base-shader.mjs";

/**
 * Allow coloring of illumination
 */
declare class TorchIlluminationShader extends AdaptiveIlluminationShader {
  protected static override _createFragmentShader(): string;
}

declare namespace TorchIlluminationShader {
  interface Any extends AnyTorchIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyTorchIlluminationShader> {}
}

/**
 * Torch animation coloration shader
 */
declare class TorchColorationShader extends AdaptiveColorationShader {
  protected static override _createFragmentShader(): string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   ratio: 0,
   *   brightnessPulse: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace TorchColorationShader {
  interface Any extends AnyTorchColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyTorchColorationShader> {}
}

export { TorchColorationShader, TorchIlluminationShader };

declare abstract class AnyTorchColorationShader extends TorchColorationShader {
  constructor(...args: never);
}

declare abstract class AnyTorchIlluminationShader extends TorchIlluminationShader {
  constructor(...args: never);
}
