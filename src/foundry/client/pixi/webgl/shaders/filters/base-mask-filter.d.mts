export {};

declare abstract class AnyAbstractBaseMaskFilter extends AbstractBaseMaskFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace AbstractBaseMaskFilter {
    type AnyConstructor = typeof AnyAbstractBaseMaskFilter;
  }

  /**
   * This class defines an interface for masked custom filters
   */
  class AbstractBaseMaskFilter extends AbstractBaseFilter {
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
