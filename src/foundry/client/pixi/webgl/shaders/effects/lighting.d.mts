import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

declare global {
  interface ShaderTechnique {
    /** The numeric identifier of the technique */
    id: number;

    /** The localization string that labels the technique */
    label: string;

    /**  The coloration shader fragment when the technique is used */
    coloration: string | undefined;

    /** The illumination shader fragment when the technique is used */
    illumination: string | undefined;

    /** The background shader fragment when the technique is used */
    background: string | undefined;
  }

  /**
   * This class defines an interface which all adaptive lighting shaders extend.
   */
  class AdaptiveLightingShader extends AbstractBaseShader {
    static override create<T extends AdaptiveLightingShader>(
      this: ConstructorOf<T>,
      defaultUniforms?: AbstractBaseShader.Uniforms,
    ): T;

    static override vertexShader: string;

    /**
     * Determine the correct penalty to apply for a given darkness level and luminosity
     * @param darknessLevel - The current darkness level on [0,1]
     * @param luminosity    - The light source luminosity on [-1,1]
     * @returns The amount of penalty to apply on [0,1]
     */
    getDarknessPenalty(darknessLevel: number, luminosity: number): number;

    /**
     * Construct adaptive shader according to shader type
     * @param shaderType - shader type to construct : coloration, illumination, background, etc.
     * @returns the constructed shader adaptive block
     */
    static getShaderTechniques(shaderType: AdaptiveLightingShader.ShaderTypes): string;

    /**
     * The coloration technique coloration shader fragment
     */
    static get COLORATION_TECHNIQUES(): ReturnType<(typeof AdaptiveLightingShader)["getShaderTechniques"]>;

    /**
     * The coloration technique illumination shader fragment
     */
    static get ILLUMINATION_TECHNIQUES(): ReturnType<(typeof AdaptiveLightingShader)["getShaderTechniques"]>;

    /**
     * The coloration technique background shader fragment
     */
    static get BACKGROUND_TECHNIQUES(): ReturnType<(typeof AdaptiveLightingShader)["getShaderTechniques"]>;

    /**
     * The adjustments made into fragment shaders
     */
    static get ADJUSTMENTS(): string;

    /**
     * Contrast adjustment
     */
    static CONTRAST: string;

    /**
     * Saturation adjustment
     */
    static SATURATION: string;

    /**
     * Exposure adjustment
     */
    static EXPOSURE: string;

    /**
     * Switch between an inner and outer color, by comparing distance from center to ratio
     * Apply a strong gradient between the two areas if attenuation uniform is set to true
     */
    static SWITCH_COLOR: string;

    /**
     * Shadow adjustment
     */
    static SHADOW: string;

    /**
     * Transition between bright and dim colors, if requested
     */
    static TRANSITION: string;

    /**
     * Incorporate falloff if a attenuation uniform is requested
     */
    static FALLOFF: string;

    /**
     * Initialize fragment with common properties
     */
    static FRAGMENT_BEGIN: string;

    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * A mapping of available coloration techniques
     */
    static SHADER_TECHNIQUES: AdaptiveLightingShader.ShaderTechniques;
  }

  namespace AdaptiveLightingShader {
    type ShaderTypes = "coloration" | "illumination" | "background" | string;

    interface ShaderTechniques extends Record<string, ShaderTechnique> {
      LEGACY: ShaderTechnique;
      LUMINANCE: ShaderTechnique;
      INTERNAL_HALO: ShaderTechnique;
      EXTERNAL_HALO: ShaderTechnique;
      COLOR_BURN: ShaderTechnique;
      INTERNAL_BURN: ShaderTechnique;
      EXTERNAL_BURN: ShaderTechnique;
      LOW_ABSORPTION: ShaderTechnique;
      HIGH_ABSORPTION: ShaderTechnique;
      INVERT_ABSORPTION: ShaderTechnique;
      NATURAL_LIGHT: ShaderTechnique;
    }
  }

  /**
   * The default coloration shader used by standard rendering and animations
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveBackgroundShader extends AdaptiveLightingShader {
    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * Incorporate falloff if a gradual uniform is requested
     */
    static FALLOFF: string;

    /**
     * Memory allocations for the Adaptive Background Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```javascript
     * {
     *  const initial = foundry.data.LightData.cleanData();
     *     return {
     *       technique: initial.coloration,
     *       contrast: initial.contrast,
     *       shadows: initial.shadows,
     *       saturation: initial.saturation,
     *       intensity: initial.animation.intensity,
     *       attenuation: initial.attenuation,
     *       exposure: 0,
     *       ratio: 0.5,
     *       darkness: false,
     *       color: [1, 1, 1],
     *       colorBackground: [1, 1, 1],
     *       screenDimensions: [1, 1],
     *       time: 0,
     *       useSampler: true,
     *       primaryTexture: null,
     *       depthTexture: null,
     *       depthElevation: 1
     *     };
     *   }
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

  /**
   * The default coloration shader used by standard rendering and animations
   * A fragment shader which creates a solid light source.
   */
  class AdaptiveIlluminationShader extends AdaptiveLightingShader {
    static override FRAGMENT_BEGIN: string;

    static override FRAGMENT_END: string;

    /**
     * Incorporate falloff if a gradual uniform is requested
     */
    static FALLOFF: string;

    /**
     * The adjustments made into fragment shaders
     */
    static get ADJUSTMENTS(): string;

    static override EXPOSURE: string;

    /**
     * Memory allocations for the Adaptive Illumination Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```javascript{
     *    const initial = foundry.data.LightData.cleanData();
     *    return {
     *      technique: initial.coloration,
     *      shadows: initial.shadows,
     *      saturation: initial.saturation,
     *      intensity: initial.animation.intensity,
     *      attenuation: initial.attenuation,
     *      contrast: initial.contrast,
     *      exposure: 0,
     *      ratio: 0.5,
     *      darkness: false,
     *      darknessLevel: 0,
     *      color: [1, 1, 1],
     *      colorBackground: [1, 1, 1],
     *      colorDim: [1, 1, 1],
     *      colorBright: [1, 1, 1],
     *      screenDimensions: [1, 1],
     *      time: 0,
     *      useSampler: false,
     *      primaryTexture: null,
     *      framebufferTexture: null,
     *      depthTexture: null,
     *      depthElevation: 1
     *    };
     *  }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the illumination shader is currently required.
     */
    get isRequired(): boolean;
  }

  /**
   * The default coloration shader used by standard rendering and animations.
   * A fragment shader which creates a light source.
   */
  class AdaptiveColorationShader extends AdaptiveLightingShader {
    /**
     * Shader final
     */
    static FRAGMENT_END: string;

    /**
     * The adjustments made into fragment shaders
     */
    static override get ADJUSTMENTS(): string;

    static override SHADOW: string;

    /**
     * Incorporate falloff if a falloff uniform is requested
     */
    static override FALLOFF: string;

    /**
     * Memory allocations for the Adaptive Coloration Shader
     */
    static SHADER_HEADER: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```javascript
     * {
     *   const initial = foundry.data.LightData.cleanData();
     *     return {
     *       technique: initial.coloration,
     *       shadows: initial.shadows,
     *       saturation: initial.saturation,
     *       colorationAlpha: 1,
     *       intensity: initial.animation.intensity,
     *       attenuation: initial.attenuation,
     *       ratio: 0.5,
     *       color: [1, 1, 1],
     *       time: 0,
     *       darkness: false,
     *       hasColor: false,
     *       screenDimensions: [1, 1],
     *       useSampler: false,
     *       primaryTexture: null,
     *       depthTexture: null,
     *       depthElevation: 1
     *     };
     *   }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Flag whether the coloration shader is currently required.
     */
    get isRequired(): boolean;
  }

  /**
   * Allow coloring of illumination
   */
  class TorchIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Torch animation coloration shader
   */
  class TorchColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```javascript
     * {...super.defaultUniforms, ratio: 0, brightnessPulse: 1}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Pulse animation illumination shader
   */
  class PulseIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Pulse animation coloration shader
   */
  class PulseColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```javascript
     * {...super.defaultUniforms, pulse: 0}
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Energy field animation coloration shader
   */
  class EnergyFieldColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Chroma animation coloration shader
   */
  class ChromaColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Wave animation illumination shader
   */
  class WaveIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Wave animation coloration shader
   */
  class WaveColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Bewitching Wave animation illumination shader
   */
  class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Bewitching Wave animation coloration shader
   */
  class BewitchingWaveColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Fog animation coloration shader
   */
  class FogColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Light dome animation coloration shader
   */
  class LightDomeColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Emanation animation coloration shader
   */
  class EmanationColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Ghost light animation illumination shader
   */
  class GhostLightIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Ghost light animation coloration shader
   */
  class GhostLightColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Hexagonal dome animation coloration shader
   */
  class HexaDomeColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Roiling mass illumination shader - intended primarily for darkness
   */
  class RoilingIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Black Hole animation illumination shader
   */
  class BlackHoleIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Swirling rainbow animation coloration shader
   */
  class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Radial rainbow animation coloration shader
   */
  class RadialRainbowColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Fairy light animation coloration shader
   */
  class FairyLightColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * Fairy light animation illumination shader
   */
  class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Alternative torch illumination shader
   */
  class FlameIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {...super.defaultUniforms, brightnessPulse: 1}
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Alternative torch coloration shader
   */
  class FlameColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * { ...super.defaultUniforms, brightnessPulse: 1}
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * A futuristic Force Grid animation.
   */
  class ForceGridColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * A disco like star light.
   */
  class StarLightColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;
  }

  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;
  }

  /**
   * Revolving animation coloration shader
   */
  class RevolvingColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Siren light animation coloration shader
   */
  class SirenColorationShader extends AdaptiveColorationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   ratio: 0,
     *   brightnessPulse: 1,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Siren light animation illumination shader
   */
  class SirenIlluminationShader extends AdaptiveIlluminationShader {
    static fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.45,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
