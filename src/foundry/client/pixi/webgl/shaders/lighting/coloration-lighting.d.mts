import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * The default coloration shader used by standard rendering and animations.
   * A fragment shader which creates a light source.
   */
  class AdaptiveColorationShader extends AdaptiveLightingShader {
    static override FRAGMENT_END: string;

    /**
     * The adjustments made into fragment shaders
     */
    static override get ADJUSTMENTS(): string;

    static override SHADOW: string;

    /**
     * Memory allocations for the Adaptive Coloration Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   technique: 1,
     *   shadows: 0,
     *   contrast: 0,
     *   saturation: 0,
     *   colorationAlpha: 1,
     *   intensity: 5,
     *   attenuation: 0.5,
     *   ratio: 0.5,
     *   color: [1, 1, 1],
     *   time: 0,
     *   hasColor: false,
     *   screenDimensions: [1, 1],
     *   useSampler: false,
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
     * Flag whether the coloration shader is currently required.
     */
    get isRequired(): boolean;
  }

  namespace AdaptiveColorationShader {
    interface Any extends AnyAdaptiveColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyAdaptiveColorationShader> {}
  }
}

declare abstract class AnyAdaptiveColorationShader extends AdaptiveColorationShader {
  constructor(...args: never);
}
