/**
 * This class defines an interface for masked custom filters
 */
declare abstract class AbstractBaseMaskFilter extends PIXI.Filter {
  /**
   * The default vertex shader used by all instances of AbstractBaseMaskFilter
   */
  static vertexShader: string;

  /**
   * The fragment shader which renders this filter.
   * A subclass of AbstractBaseMaskFilter must implement the fragmentShader(channel) static field.
   */
  static fragmentShader: ((channel: 'r' | 'g' | 'b') => string) | null;

  /**
   * A factory method for creating the filter using its defined default values
   * @param defaultUniforms - Initial uniforms provided to the filter
   *                          (default: `{}`)
   * @param channel         - A color channel to target for masking.
   *                          (default: `'r'`)
   */
  static create<T extends AbstractBaseMaskFilter>(
    this: ConstructorOf<T>,
    defaultUniforms?: ConstructorParameters<typeof PIXI.Filter>[2],
    channel?: 'r' | 'g' | 'b'
  ): T;

  /**
   * @override
   * @param currentState - (unused)
   */
  apply(
    filterManager: PIXI.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear?: PIXI.CLEAR_MODES,
    currentState?: PIXI.FilterState
  ): void;
}
