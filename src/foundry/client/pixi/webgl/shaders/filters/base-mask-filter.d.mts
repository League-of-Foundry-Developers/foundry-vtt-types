export {};

declare global {
  /**
   * This class defines an interface for masked custom filters
   */
  class AbstractBaseMaskFilter extends AbstractBaseFilter {
    /**
     * The default vertex shader used by all instances of AbstractBaseMaskFilter
     */
    static vertexShader: string;

    /** @remarks Foundry does not use the `currentState` param */
    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
      currentState?: PIXI.FilterState,
    ): void;
  }

  namespace AbstractBaseMaskFilter {
    interface Any extends AnyAbstractBaseMaskFilter {}
    type AnyConstructor = typeof AnyAbstractBaseMaskFilter;
  }
}

declare abstract class AnyAbstractBaseMaskFilter extends AbstractBaseMaskFilter {
  constructor(arg0: never, ...args: never[]);
}
