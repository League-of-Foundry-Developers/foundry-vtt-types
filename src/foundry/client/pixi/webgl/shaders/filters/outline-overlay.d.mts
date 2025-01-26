import type { FixedInstanceType } from "fvtt-types/utils";

declare abstract class AnyOutlineOverlayFilter extends OutlineOverlayFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace OutlineOverlayFilter {
    type AnyConstructor = typeof AnyOutlineOverlayFilter;
  }

  /**
   * A filter which implements an outline.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/outline
   * @remarks MIT License
   */
  class OutlineOverlayFilter extends AbstractBaseFilter {
    /**
     * @defaultValue `3`
     */
    override padding: number;

    /**
     * @defaultValue `false`
     */
    override autoFit: boolean;

    /**
     * If the filter is animated or not.
     * @defaultValue `true`
     */
    animated: boolean;

    /**
     * @defaultValue
     * ```js
     * {
     *    outlineColor: [1, 1, 1, 1],
     *    thickness: [1, 1],
     *    alphaThreshold: 0.60,
     *    knockout: true,
     *    wave: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    /**
     * Dynamically create the fragment shader used for filters of this type.
     */
    static createFragmentShader(): string;

    /**
     * The thickness of the outline.
     */
    get thickness(): number;

    set thickness(value);

    static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): FixedInstanceType<ThisType>;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;

    /**
     * @deprecated since v12, until v14
     * @remarks OutlineOverlayFilter#animate is deprecated in favor of OutlineOverlayFilter#animated.
     */
    get animate(): boolean;

    /**
     * @deprecated since v12, until v14
     * @remarks OutlineOverlayFilter#animate is deprecated in favor of OutlineOverlayFilter#animated.
     */
    set animate(v);
  }
}
