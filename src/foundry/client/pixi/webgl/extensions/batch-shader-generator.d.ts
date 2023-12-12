export {};

declare global {
  /**
   * A batch shader generator that could handle extra uniforms during initialization.
   */
  class BatchShaderGenerator extends PIXI.BatchShaderGenerator {}
}
