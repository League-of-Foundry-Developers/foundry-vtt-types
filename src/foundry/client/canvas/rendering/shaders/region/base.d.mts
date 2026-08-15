import type { Identity } from "#utils";
import type { AbstractBaseShader } from "../_module.mjs";

/**
 * The shader used by {@linkcode foundry.canvas.placeables.regions.RegionMesh}.
 */
declare class RegionShader extends AbstractBaseShader {
  protected static override _createVertexShader(): string;

  protected static override _createFragmentShader(): string;

  /**
   * @defaultValue
   * ```js
   * {
   *   canvasDimensions: [1, 1],
   *   sceneDimensions: [0, 0, 1, 1],
   *   screenDimensions: [1, 1],
   *   tintAlpha: [1, 1, 1, 1]
   * }
   * ```
   */
  static override get defaultUniforms(): AbstractBaseShader.Uniforms;

  protected override _preRender: AbstractBaseShader.PreRenderFunction;
}

declare namespace RegionShader {
  interface Any extends AnyRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyRegionShader> {}
}

export default RegionShader;

declare abstract class AnyRegionShader extends RegionShader {
  constructor(...args: never);
}
