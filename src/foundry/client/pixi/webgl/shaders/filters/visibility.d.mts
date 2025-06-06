import type { FixedInstanceType, Identity, NullishProps } from "#utils";

declare global {
  /**
   * Apply visibility coloration according to the baseLine color.
   * Uses very lightweight gaussian vertical and horizontal blur filter passes.
   */
  class VisibilityFilter extends AbstractBaseMaskFilter {
    constructor(...args: ConstructorParameters<typeof AbstractBaseMaskFilter>);

    /**
     * @defaultValue
     * ```js
     * {
     *    exploredColor: [1, 1, 1],
     *    unexploredColor: [0, 0, 0],
     *    screenDimensions: [1, 1],
     *    visionTexture: null,
     *    primaryTexture: null,
     *    overlayTexture: null,
     *    overlayMatrix: new PIXI.Matrix(),
     *    hasOverlayTexture: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
      this: ThisType,
      initiaUniforms?: AbstractBaseShader.Uniforms | null,
      options?: VisibilityFilter.FragmentShaderOptions, // not:null (passed to `this.fragmentShader()` where its properties are accesed unsafely),
    ): FixedInstanceType<ThisType>;

    static override vertexShader: string;

    static override fragmentShader(options: VisibilityFilter.FragmentShaderOptions): string;

    /**
     * Set the blur strength
     * @param value - blur strength
     */
    set blur(value: number);

    get blur(): number;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;

    /**
     * Calculate the fog overlay sprite matrix.
     */
    calculateMatrix(filterManager: PIXI.FilterSystem): void;
  }

  namespace VisibilityFilter {
    interface Any extends AnyVisibilityFilter {}
    interface AnyConstructor extends Identity<typeof AnyVisibilityFilter> {}

    type ConfiguredClass = CONFIG["Canvas"]["visibilityFilter"];
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    /** @internal */
    type _FragmentShaderOptions = NullishProps<{
      persistentVision: boolean;
    }>;

    interface FragmentShaderOptions extends _FragmentShaderOptions {}
  }
}

declare abstract class AnyVisibilityFilter extends VisibilityFilter {
  constructor(...args: never);
}
