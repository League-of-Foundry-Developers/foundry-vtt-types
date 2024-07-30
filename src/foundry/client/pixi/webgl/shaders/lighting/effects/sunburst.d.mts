export {};

declare global {
  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
