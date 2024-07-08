import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * A filter which implements an outline.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/outline
   * @remarks MIT License
   */
  class OutlineOverlayFilter extends AbstractBaseFilter {
    override padding: number;

    override autoFit: boolean;

    /**
     * If the filter is animated or not.
     * @defaultValue `true`
     */
    animate: boolean;

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

    static createFragmentShader(): string;

    /**
     * The thickness of the outline.
     */
    get thickness(): number;

    set thickness(value);

    static override create<T extends OutlineOverlayFilter>(
      this: ConstructorOf<T>,
      uniforms?: AbstractBaseShader.Uniforms,
    ): T;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
  }
}
