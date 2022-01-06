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
  /** @override */
  static vertexShader: string;

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
