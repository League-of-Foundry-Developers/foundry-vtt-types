import type { Identity } from "#utils";
import type { DepthSamplerShader, OccludableSamplerShader } from "../../_module.mjs";

/**
 * The base shader class of {@linkcode foundry.canvas.primary.PrimarySpriteMesh}.
 */
declare class PrimaryBaseSamplerShader extends OccludableSamplerShader {
  /**
   * The depth shader class associated with this shader.
   * @defaultValue `DepthSampleShader`
   */
  static depthShaderClass: typeof DepthSamplerShader;

  /**
   * The depth shader associated with this shader.
   * The depth shader is lazily constructed.
   */
  get depthShader(): DepthSamplerShader;

  /**
   * One-time configuration that is called when the depth shader is created.
   * @param depthShader - The depth shader
   */
  protected _configureDepthShader(depthShader: DepthSamplerShader): void;
}

declare namespace PrimaryBaseSamplerShader {
  interface Any extends AnyPrimaryBaseSamplerShader {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryBaseSamplerShader> {}
}

export default PrimaryBaseSamplerShader;

declare abstract class AnyPrimaryBaseSamplerShader extends PrimaryBaseSamplerShader {
  constructor(...args: never);
}
