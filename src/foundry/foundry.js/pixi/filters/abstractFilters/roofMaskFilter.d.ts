/**
 * This filter turns pixels with an alpha channel &lt; alphaThreshold in transparent pixels
 * Then, optionally, it can turn the result in the chosen color (default: pure white).
 * The alpha [threshold,1] is re-mapped to [0,1] with an hermite interpolation slope to prevent pixelation.
 */
declare class RoofMaskFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   alphaThreshold: 0.75,
   *   turnToColor: false,
   *   color: [1, 1, 1]
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}
