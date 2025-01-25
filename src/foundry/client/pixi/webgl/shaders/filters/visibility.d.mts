import type { InexactPartial, FixedInstanceType } from "fvtt-types/utils";

declare abstract class AnyVisibilityFilter extends VisibilityFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace VisibilityFilter {
    type AnyConstructor = typeof AnyVisibilityFilter;

    interface FragmentShaderOptions {
      persistentVision: boolean;
    }
  }

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
      initiaUniforms?: AbstractBaseShader.Uniforms,
      options?: InexactPartial<VisibilityFilter.FragmentShaderOptions>,
    ): FixedInstanceType<ThisType>;

    static override vertexShader: string;

    static override fragmentShader(options: InexactPartial<VisibilityFilter.FragmentShaderOptions>): string;

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
}
