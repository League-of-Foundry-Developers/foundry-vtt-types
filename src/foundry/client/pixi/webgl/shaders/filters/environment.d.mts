export {};

declare abstract class AnyPrimaryCanvasGroupAmbienceFilter extends PrimaryCanvasGroupAmbienceFilter {
  constructor(arg0: never, ...args: never[]);
}
declare global {
  namespace PrimaryCanvasGroupAmbienceFilter {
    type AnyConstructor = typeof AnyPrimaryCanvasGroupAmbienceFilter;
  }

  /**
   * A filter used to apply color adjustments and other modifications to the environment.
   */
  class PrimaryCanvasGroupAmbienceFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: AbstractBaseFilter.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *    uSampler: null,
     *    darknessLevelTexture: null,
     *    cycle: true,
     *    baseTint: [1, 1, 1], // Important: The base tint uniform must be in linear RGB!
     *    baseIntensity: 0,
     *    baseLuminosity: 0,
     *    baseSaturation: 0,
     *    baseShadows: 0,
     *    darkTint: [1, 1, 1], // Important: The dark tint uniform must be in linear RGB!
     *    darkIntensity: 0,
     *    darkLuminosity: 0,
     *    darkSaturation: 0,
     *    darkShadows: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
