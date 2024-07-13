export {};

declare global {
  /**
   * Bewitching Wave animation illumination shader
   */
  class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Bewitching Wave animation coloration shader
   */
  class BewitchingWaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
