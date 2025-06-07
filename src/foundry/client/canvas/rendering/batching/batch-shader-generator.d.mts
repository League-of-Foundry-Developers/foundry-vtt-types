import type { Identity } from "#utils";
import type BatchRenderer from "./batch-renderer.mjs";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * A batch shader generator that could handle extra uniforms during initialization.
 * @param vertexSrc    - The vertex shader source
 * @param fragTemplate - The fragment shader source template
 * @param uniforms     - Additional uniforms (default: `{}`)
 */
declare class BatchShaderGenerator extends PIXI.BatchShaderGenerator {
  constructor(
    vertexSrc: string,
    fragTemplate: string,
    uniforms?: AbstractBaseShader.Uniforms | BatchRenderer.BatchDefaultUniformsFunction,
  );

  override generateShader(maxTextures: number): PIXI.Shader;
}

declare namespace BatchShaderGenerator {
  interface Any extends AnyBatchShaderGenerator {}
  interface AnyConstructor extends Identity<typeof AnyBatchShaderGenerator> {}
}

export default BatchShaderGenerator;

declare abstract class AnyBatchShaderGenerator extends BatchShaderGenerator {
  constructor(...args: never);
}
