export {};

declare global {
  /**
   * A filter used to apply color adjustments and other modifications to the environment.
   */
  class PrimaryCanvasGroupAmbienceFilter extends AbstractBaseMaskFilter {
    static override fragmentShader: string;

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

  namespace PrimaryCanvasGroupAmbienceFilter {
    interface Any extends AnyPrimaryCanvasGroupAmbienceFilter {}
    type AnyConstructor = typeof AnyPrimaryCanvasGroupAmbienceFilter;
  }
}

declare abstract class AnyPrimaryCanvasGroupAmbienceFilter extends PrimaryCanvasGroupAmbienceFilter {
  constructor(arg0: never, ...args: never[]);
}
