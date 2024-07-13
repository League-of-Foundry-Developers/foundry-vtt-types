export {};

declare global {
  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
