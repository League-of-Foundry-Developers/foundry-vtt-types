import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * A filter which implements an inner or outer glow around the source texture.
   * Inspired from https://github.com/pixijs/filters/tree/main/filters/glow
   * @remarks MIT License
   */
  class GlowOverlayFilter extends AbstractBaseFilter {
    /**
     * @defaultValue `6`
     */
    override padding: number;

    /**
     * The inner strength of the glow.
     * @defaultValue `3`
     */
    innerStrength: number;

    /**
     * The outer strength of the glow.
     * @defaultValue `3`
     */
    outerStrength: number;

    /**
     * Should this filter auto-animate?
     * @defaultValue `true`
     */
    animated: number;

    /**
     * @defaultValue
     * ```typescript
     * {
     *   distance: 10,
     *   innerStrength: 0,
     *   glowColor: [1, 1, 1, 1],
     *   quality: 0.1,
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms & { distance: number; quality: number };

    static createFragmentShader(quality: number, distance: number): string;

    static override vertexShader: string;

    static override create<T extends GlowOverlayFilter>(
      this: ConstructorOf<T>,
      uniforms: AbstractBaseShader.Uniforms,
    ): T;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
    ): void;
  }
}
