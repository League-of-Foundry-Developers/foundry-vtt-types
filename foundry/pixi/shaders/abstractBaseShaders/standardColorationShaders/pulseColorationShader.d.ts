/**
 * Pulse animation coloration shader
 */
declare class PulseColorationShader extends StandardColorationShader {
  static fragmentShader: string;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   alpha: 1.0,
   *   color: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5,
   *   darkness: false,
   *   pulse: 0,
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;
}
