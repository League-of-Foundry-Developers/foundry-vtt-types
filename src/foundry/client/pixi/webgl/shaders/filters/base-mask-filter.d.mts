export {};

declare global {
  /**
   * This class defines an interface for masked custom filters
   */
  class AbstractBaseMaskFilter extends AbstractBaseFilter {
    static create(uniforms?: AbstractBaseShader.Uniforms): AbstractBaseMaskFilter;

    /**
     * The default vertex shader used by all instances of AbstractBaseMaskFilter
     */
    static vertexShader: string;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
      currentState: PIXI.FilterState,
    ): void;
  }
}
