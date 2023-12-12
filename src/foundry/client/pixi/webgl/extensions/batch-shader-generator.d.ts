export {};

declare global {
  /**
   * A batch shader generator that could handle extra uniforms during initialization.
   */
  class BatchShaderGenerator extends PIXI.BatchShaderGenerator {
    constructor(vertexSrc: string, fragTemplate: string, batchDefaultUniforms?: (...args: any[]) => any);

    /**
     * Extra uniforms that could be handled by a custom batch shader.
     */
    _batchDefaultUniforms: (...args: any[]) => any | undefined;

    override generateShader(maxTextures: number): PIXI.Shader;
  }
}
