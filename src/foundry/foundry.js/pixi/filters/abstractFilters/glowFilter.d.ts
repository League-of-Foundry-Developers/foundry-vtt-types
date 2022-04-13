/**
 * A filter which implements an inner or outer glow around the source texture.
 * Incorporated from https://github.com/pixijs/filters/tree/main/filters/glow
 */
declare class GlowFilter extends AbstractFilter {
  /**
   * @override
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
  static defaultUniforms: AbstractBaseShader.Uniforms & { distance: number; quality: number };

  /**
   * @override
   * @remarks This could change, see https://gitlab.com/foundrynet/foundryvtt/-/issues/6937
   */
  static fragmentShader(quality: number, distance: number): string;

  /** @override */
  static vertexShader: string;

  /** @override */
  static create(uniforms: AbstractBaseShader.Uniforms): GlowFilter;
}
