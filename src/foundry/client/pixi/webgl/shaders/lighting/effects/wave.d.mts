export {};

declare global {
  /**
   * Wave animation illumination shader
   */
  class WaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Wave animation coloration shader
   */
  class WaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
