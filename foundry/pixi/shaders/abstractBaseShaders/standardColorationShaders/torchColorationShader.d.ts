/**
 * Torch animation coloration shader
 */
declare class TorchColorationShader extends StandardColorationShader {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   alpha: 1.0,
   *   color: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5,
   *   darkness: false,
   *   ratio: 0,
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}
