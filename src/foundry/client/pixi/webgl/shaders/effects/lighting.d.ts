interface LightingTechnique {
  /** The numeric identifier of the technique */
  id: number;

  /** The localization string that labels the technique */
  label: string;

  /** The shader fragment when the technique is used */
  shader: string;
}

/**
 * This class defines an interface which all adaptive lighting shaders extend.
 */
declare class AdaptiveLightingShader extends AbstractBaseShader {
  static override vertexShader: string;

  /**
   * Useful constant values computed at compile time
   */
  static CONSTANTS: string;

  /**
   * The coloration technique shader fragment
   */
  static get ADAPTIVE_COLORATION(): string;

  /**
   * Fade easing to use with distance in interval [0,1]
   * @param amp  - (default: `3`)
   * @param coef - (default: `0.80`)
   */
  static FADE(amp?: number, coef?: number): string;

  /**
   * Fractional Brownian Motion for a given number of octaves
   * @param octaves - (default: `4`)
   * @param amp     - (default: `1.0`)
   */
  static FBM(octaves?: number, amp?: number): string;

  /**
   * A conventional pseudo-random number generator with the "golden" numbers, based on uv position
   */
  static PRNG: string;

  /**
   * A Vec3 pseudo-random generator, based on uv position
   */
  static PRNG3D: string;

  /**
   * A conventional noise generator
   */
  static NOISE: string;

  /**
   * Convert a Hue-Saturation-Brightness color to RGB - useful to convert polar coordinates to RGB
   */
  static HSB2RGB: string;

  /**
   * Fast approximate perceived brightness computation
   * Using Digital ITU BT.709 : Exact luminance factors
   */
  static PERCEIVED_BRIGHTNESS: string;

  /**
   * Switch between an inner and outer color, by comparing distance from center to ratio
   * Apply a strong gradient between the two areas if gradual uniform is set to true
   */
  static SWITCH_COLOR: string;

  /**
   * Transition between bright and dim colors, if requested
   */
  static TRANSITION: string;

  /**
   * Constrain light to LOS
   */
  static CONSTRAIN_TO_LOS: string;

  /**
   * Incorporate falloff if a gradual uniform is requested
   */
  static FALLOFF: string;

  /**
   * Compute distance from the light center
   */
  static DISTANCE: string;

  /**
   * A mapping of available coloration techniques
   */
  static COLORATION_TECHNIQUES: AdaptiveLightingShader.ColorationTechniques;
}

declare namespace AdaptiveLightingShader {
  interface ColorationTechniques extends Record<string, LightingTechnique> {
    LEGACY: LightingTechnique;
    LUMINANCE: LightingTechnique;
    INTERNAL_HALO: LightingTechnique;
    EXTERNAL_HALO: LightingTechnique;
    COLOR_BURN: LightingTechnique;
    INTERNAL_BURN: LightingTechnique;
    EXTERNAL_BURN: LightingTechnique;
    LOW_ABSORPTION: LightingTechnique;
    HIGH_ABSORPTION: LightingTechnique;
    INVERT_ABSORPTION: LightingTechnique;
  }
}

/**
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class AdaptiveBackgroundShader extends AdaptiveLightingShader {
  /**
   * Constrain light to LOS
   */
  static CONSTRAIN_TO_LOS: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

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
   *   shadows: 0.0,
   *   contrast: 0.0,
   *   exposure: 0.0,
   *   saturation: 0.0,
   *   alpha: 1.0,
   *   ratio: 0.5,
   *   time: 0,
   *   screenDimensions: [1, 1],
   *   uBkgSampler: 0,
   *   fovTexture: 0,
   *   darkness: false,
   *   gradual: false,
   *   useFov: true
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
 * The default coloration shader used by standard rendering and animations
 * A fragment shader which creates a solid light source.
 */
declare class AdaptiveIlluminationShader extends AdaptiveLightingShader {
  /**
   * Constrain light to LOS
   */
  static CONSTRAIN_TO_LOS: string;

  /**
   * Incorporate falloff if a gradual uniform is requested
   */
  static FALLOFF: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

  /**
   * Memory allocations for the Adaptive Illumination Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```javascript
   * {
   *   alpha: 1.0,
   *   ratio: 0.5,
   *   color: [0.9333333333333333, 0.9333333333333333, 0.9333333333333333],
   *   colorDim: [0.5, 0.5, 0.5],
   *   colorBright: [1.0, 1.0, 1.0],
   *   colorBackground: [1.0, 1.0, 1.0],
   *   darkness: false,
   *   exposure: 0.0,
   *   fovTexture: 0,
   *   gradual: false,
   *   intensity: 5,
   *   saturation: 0.0,
   *   screenDimensions: [1, 1],
   *   shadows: 0.0,
   *   time: 0,
   *   uBkgSampler: 0,
   *   useFov: true
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * Determine the correct illumination penalty to apply for a given darkness level and luminosity
   * @param darknessLevel - The current darkness level on [0,1]
   * @param luminosity    - The light source luminosity on [-1,1]
   * @returns The amount of penalty to apply on [0,1]
   */
  getDarknessPenalty(darknessLevel: number, luminosity: number): number;
}

/**
 * The default coloration shader used by standard rendering and animations.
 * A fragment shader which creates a light source.
 */
declare class AdaptiveColorationShader extends AdaptiveLightingShader {
  /**
   * Incorporate falloff if a falloff uniform is requested
   */
  static FALLOFF: string;

  /**
   * Color adjustments : exposure, contrast and shadows
   */
  static ADJUSTMENTS: string;

  /**
   * Memory allocations for the Adaptive Coloration Shader
   */
  static SHADER_HEADER: string;

  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```javascript
   * {
   *   technique: 1,
   *   ratio: 0.0,
   *   shadows: 0.0,
   *   saturation: 0.0,
   *   alpha: 1.0,
   *   color: [1.0, 1.0, 1.0],
   *   time: 0,
   *   intensity: 5,
   *   darkness: false,
   *   screenDimensions: [1, 1],
   *   uBkgSampler: 0,
   *   fovTexture: 0,
   *   gradual: true,
   *   useFov: true
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

/**
 * Allow coloring of illumination
 */
declare class TorchIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Torch animation coloration shader
 */
declare class TorchColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;

  /**
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   ratio: 0,
   *   brightnessPulse: 1
   * })
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

/**
 * Pulse animation illumination shader
 */
declare class PulseIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Pulse animation coloration shader
 */
declare class PulseColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;

  /**
   * @defaultValue
   * ```typescript
   * Object.assign({}, super.defaultUniforms, {
   *   pulse: 0
   * })
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

/**
 * Energy field animation coloration shader
 */
declare class EnergyFieldColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Chroma animation coloration shader
 */
declare class ChromaColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Wave animation illumination shader
 */
declare class WaveIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Wave animation coloration shader
 */
declare class WaveColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Bewitching Wave animation illumination shader
 */
declare class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Bewitching Wave animation coloration shader
 */
declare class BewitchingWaveColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Fog animation coloration shader
 */
declare class FogColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Sunburst animation illumination shader
 */
declare class SunburstIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Sunburst animation coloration shader
 */
declare class SunburstColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Light dome animation coloration shader
 */
declare class LightDomeColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Emanation animation coloration shader
 */
declare class EmanationColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Ghost light animation illumination shader
 */
declare class GhostLightIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Ghost light animation coloration shader
 */
declare class GhostLightColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Hexagonal dome animation coloration shader
 */
declare class HexaDomeColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Roiling mass illumination shader - intended primarily for darkness
 */
declare class RoilingIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Black Hole animation illumination shader
 */
declare class BlackHoleIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Vortex animation coloration shader
 */
declare class VortexColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Vortex animation coloration shader
 */
declare class VortexIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}

/**
 * Swirling rainbow animation coloration shader
 */
declare class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Radial rainbow animation coloration shader
 */
declare class RadialRainbowColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Fairy light animation coloration shader
 */
declare class FairyLightColorationShader extends AdaptiveColorationShader {
  static fragmentShader: string;
}

/**
 * Fairy light animation illumination shader
 */
declare class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
  static fragmentShader: string;
}
