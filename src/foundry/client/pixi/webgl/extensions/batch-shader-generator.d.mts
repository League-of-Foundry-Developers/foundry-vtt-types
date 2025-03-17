import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * A batch shader generator that could handle extra uniforms during initialization.
   * @param vertexSrc    - The vertex shader source
   * @param fragTemplate - The fragment shader source template
   * @param uniforms     - Additional uniforms
   */
  class BatchShaderGenerator extends PIXI.BatchShaderGenerator {
    constructor(
      vertexSrc: string,
      fragTemplate: string,
      /**
       * @defaultValue `{}`
       */
      uniforms?: AbstractBaseShader.Uniforms | BatchRenderer.BatchDefaultUniformsFunction,
    );

    override generateShader(maxTextures: number): PIXI.Shader;
  }

  namespace BatchShaderGenerator {
    interface Any extends AnyBatchShaderGenerator {}
    interface AnyConstructor extends Identity<typeof AnyBatchShaderGenerator> {}
  }
}

declare abstract class AnyBatchShaderGenerator extends BatchShaderGenerator {
  constructor(arg0: never, ...args: never[]);
}
