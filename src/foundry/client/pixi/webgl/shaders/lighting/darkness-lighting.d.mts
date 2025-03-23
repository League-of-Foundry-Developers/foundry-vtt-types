import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * The default coloration shader used by standard rendering and animations.
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveDarknessShader extends AdaptiveLightingShader {
    override update(): void;

    /**
     * Flag whether the darkness shader is currently required.
     * Check vision modes requirements first, then
     * if key uniforms are at their default values, we don't need to render the background container.
     */
    get isRequired(): boolean;

    /**
     * @defaultValue
     * ```js
     * {
     *   intensity: 5,
     *   color: Color.from("#8651d5").rgb,
     *   screenDimensions: [1, 1],
     *   time: 0,
     *   primaryTexture: null,
     *   depthTexture: null,
     *   visionTexture: null,
     *   darknessLevelTexture: null,
     *   depthElevation: 1,
     *   ambientBrightest: [1, 1, 1],
     *   ambientDarkness: [0, 0, 0],
     *   ambientDaylight: [1, 1, 1],
     *   weights: [0, 0, 0, 0],
     *   dimLevelCorrection: 1,
     *   brightLevelCorrection: 2,
     *   borderDistance: 0,
     *   darknessLevel: 0,
     *   computeIllumination: false,
     *   globalLight: false,
     *   globalLightThresholds: [0, 0],
     *   enableVisionMasking: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * Initialize fragment with common properties
     */
    static FRAGMENT_BEGIN: string;

    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;
  }

  namespace AdaptiveDarknessShader {
    interface Any extends AnyAdaptiveDarknessShader {}
    interface AnyConstructor extends Identity<typeof AnyAdaptiveDarknessShader> {}
  }
}

declare abstract class AnyAdaptiveDarknessShader extends AdaptiveDarknessShader {
  constructor(...args: never);
}
