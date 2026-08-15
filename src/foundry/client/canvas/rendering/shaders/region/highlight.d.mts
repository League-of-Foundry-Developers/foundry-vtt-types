import type { Identity } from "#utils";
import type { AbstractBaseShader, RegionShader } from "../_module.mjs";

/**
 * Shader for the Region highlight.
 * @internal
 */
declare class HighlightRegionShader extends RegionShader {
  protected static override _createVertexShader(): string;

  protected static override _createFragmentShader(): string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultUniforms,
   *   resolution: 1,
   *   hatchEnabled: false,
   *   hatchThickness: 1
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  protected override _preRender: AbstractBaseShader.PreRenderFunction;
}

declare namespace HighlightRegionShader {
  interface Any extends AnyHighlightRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyHighlightRegionShader> {}
}

export default HighlightRegionShader;

declare abstract class AnyHighlightRegionShader extends HighlightRegionShader {
  constructor(...args: never);
}
