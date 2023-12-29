export {};

declare global {
  /**
   * This class defines an interface which all adaptive vision shaders extend.
   */
  class AdaptiveVisionShader extends AdaptiveLightingShader {
    static override EXPOSURE: string;

    static override SHADOW: string;

    static override FALLOFF: string;

    static override FRAGMENT_BEGIN: string;

    /**
     * A mapping of available shader techniques
     */
    static override SHADER_TECHNIQUES: AdaptiveLightingShader.ShaderTechniques;
  }

  /**
   * The default background shader used for vision sources
   */
  class BackgroundVisionShader extends AdaptiveVisionShader {
    static override FRAGMENT_END: string;

    static override FALLOFF: string;

    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    technique: 0,
     *    saturation: 0,
     *    contrast: 0,
     *    attenuation: 0.10,
     *    exposure: 0,
     *    darknessLevel: 0,
     *    colorVision: [1, 1, 1],
     *    colorTint: [1, 1, 1],
     *    colorBackground: [1, 1, 1],
     *    screenDimensions: [1, 1],
     *    time: 0,
     *    useSampler: true,
     *    linkedToDarknessLevel: true,
     *    primaryTexture: null,
     *    depthTexture: null,
     *    depthElevation: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the background shader is currently required.
     * If key uniforms are at their default values, we don't need to render the background container.
     */
    get isRequired(): boolean;
  }

  /**
   * The default illumination shader used for vision sources
   */
  class IlluminationVisionShader extends AdaptiveVisionShader {
    static override FRAGMENT_BEGIN: string;

    static override FRAGMENT_END: string;

    static override FALLOFF: string;

    /**
     * Transition between bright and dim colors, if requested
     */
    static VISION_COLOR: string;

    static get ADJUSTMENTS(): string;

    /**
     * Memory allocations for the Adaptive Illumination Shader
     */
    static SHADER_HEADER: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    const initial = foundry.data.LightData.cleanData();
     *    return {
     *      technique: initial.technique,
     *      attenuation: 0,
     *      exposure: 0,
     *      saturation: 0,
     *      darknessLevel: 0,
     *      colorVision: [1, 1, 1],
     *      colorTint: [1, 1, 1],
     *      colorBackground: [1, 1, 1],
     *      screenDimensions: [1, 1],
     *      time: 0,
     *      useSampler: false,
     *      linkedToDarknessLevel: true,
     *      primaryTexture: null,
     *      framebufferTexture: null,
     *      depthTexture: null,
     *      depthElevation: 1
     *    };
     *  }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * The default coloration shader used for vision sources.
   */
  class ColorationVisionShader extends AdaptiveVisionShader {
    static override FRAGMENT_END: string;

    static override EXPOSURE: string;

    static override CONTRAST: string;

    static override FALLOFF: string;

    /**
     * Memory allocations for the Adaptive Coloration Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *      technique: 0,
     *      saturation: 0,
     *      attenuation: 0,
     *      colorEffect: [0, 0, 0],
     *      colorBackground: [0, 0, 0],
     *      colorTint: [1, 1, 1],
     *      time: 0,
     *      screenDimensions: [1, 1],
     *      useSampler: true,
     *      primaryTexture: null,
     *      linkedToDarknessLevel: true,
     *      depthTexture: null,
     *      depthElevation: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the coloration shader is currently required.
     * If key uniforms are at their default values, we don't need to render the coloration container.
     */
    get isRequired(): boolean;
  }

  /**
   * Shader specialized in wave like senses (tremorsenses)
   */
  class WaveBackgroundVisionShader extends BackgroundVisionShader {
    static override FRAGMENT_END: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, colorTint: [0.8, 0.1, 0.8]}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }

  /**
   * The wave vision shader, used to create waves emanations (ex: tremorsense)
   */
  class WaveColorationVisionShader extends ColorationVisionShader {
    static override fragmentShader: string;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }

  /**
   * Shader specialized in light amplification
   */
  class AmplificationBackgroundVisionShader extends BackgroundVisionShader {
    static override FRAGMENT_END: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, colorTint: [0.38, 0.8, 0.38], brightness: 0.5}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }
}
