export {};

declare global {
  /**
   * The default coloration shader used by standard rendering and animations
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveBackgroundShader extends AdaptiveLightingShader {
    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   technique: 1,
     *   contrast: 0,  shadows: 0,
     *   saturation: 0,
     *   intensity: 5,
     *   attenuation: 0.5,
     *   exposure: 0,
     *   ratio: 0.5,
     *   color: [1, 1, 1],
     *   colorBackground: [1, 1, 1],
     *   screenDimensions: [1, 1],
     *   time: 0,
     *   useSampler: true,
     *   primaryTexture: null,
     *   depthTexture: null,
     *   darknessLevelTexture: null,
     *   depthElevation: 1,
     *   ambientBrightest: [1, 1, 1],
     *   ambientDarkness: [0, 0, 0],
     *   ambientDaylight: [1, 1, 1],
     *   weights: [0, 0, 0, 0],
     *   dimLevelCorrection: 1,
     *   brightLevelCorrection: 2,
     *   computeIllumination: false,
     *   globalLight: false,
     *   globalLightThresholds: [0, 0]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the background shader is currently required.
     * Check vision modes requirements first, then
     * if key uniforms are at their default values, we don't need to render the background container.
     */
    get isRequired(): boolean;
  }

  namespace AdaptiveBackgroundShader {
    interface Any extends AnyAdaptiveBackgroundShader {}
    type AnyConstructor = typeof AnyAdaptiveBackgroundShader;
  }
}

declare abstract class AnyAdaptiveBackgroundShader extends AdaptiveBackgroundShader {
  constructor(arg0: never, ...args: never[]);
}
